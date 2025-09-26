import XRegExp from 'xregexp';

export class Formatter {
    constructor() {
        this.tab = '    '; // 4 spaces

        this.hublKeywordMap = {
            'for': 'for_start',
            'endfor': 'for_end',
            'if': 'if_start',
            'elif': 'elif',
            'else': 'else',
            'endif': 'if_end',
            'macro': 'macro',
            'endmacro': 'endmacro',
            'block': 'block',
            'endblock': 'endblock',
            'include': 'include',
            'import': 'import',
            'set': 'set',
        };
    }

    normalizeContent(content) {
        return content.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
    }

    splitBlocksHTML(content) {
        // Find all HubL comment ranges first
        const commentRegex = /\{#[\s\S]*?#\}/g;
        const commentRanges = [];
        let cm;
        while ((cm = commentRegex.exec(content)) !== null) {
            commentRanges.push({start: cm.index, end: cm.index + cm[0].length, text: cm[0]});
        }
        function isInsideComment(pos) {
            return commentRanges.some(r => pos >= r.start && pos < r.end);
        }
        // Now, split content into segments: HubL comments and non-comment regions
        let blocks = [];
        let index = 0;
        let pos = 0;
        for (let i = 0; i < commentRanges.length; i++) {
            const {start, end, text} = commentRanges[i];
            // Non-comment region before this comment
            if (start > pos) {
                const region = content.slice(pos, start);
                // Split this region into HTML blocks
                const tagRegex = /<\/?[a-zA-Z][^\s>\/]*[^>]*\/?>/g;
                let lastIndex = 0;
                let match;
                while ((match = tagRegex.exec(region)) !== null) {
                    const tagStart = match.index;
                    const tagEnd = tagRegex.lastIndex;
                    const tag = match[0];
                    let subtype = 'start';
                    if (/^<\s*\/.*>$/.test(tag)) subtype = 'end';
                    else if (/\/>$/.test(tag)) subtype = 'selfclosing';
                    let value = '';
                    if (tagStart > lastIndex) value += region.slice(lastIndex, tagStart);
                    value += tag;
                    if (value.trim().length > 0) {
                        blocks.push({
                            type: 'html',
                            subtype,
                            index: index++,
                            value: value.trim()
                        });
                    }
                    lastIndex = tagEnd;
                }
                // Remaining after last tag
                if (lastIndex < region.length) {
                    const remain = region.slice(lastIndex).trim();
                    if (remain.length > 0) {
                        blocks.push({
                            type: 'html',
                            subtype: 'start',
                            index: index++,
                            value: remain
                        });
                    }
                }
            }
            // Now, split the HubL comment into 3 blocks: {#, inner, #}
            blocks.push({
                type: 'hubl',
                subtype: 'comment_start',
                index: index++,
                value: '{#'
            });
            const innerContent = text.slice(2, -2).trim();
            blocks.push({
                type: 'hubl',
                subtype: 'comment_inner',
                index: index++,
                value: innerContent
            });
            blocks.push({
                type: 'hubl',
                subtype: 'comment_end',
                index: index++,
                value: '#}'
            });
            pos = end;
        }
        // Any region after last comment
        if (pos < content.length) {
            const region = content.slice(pos);
            const tagRegex = /<\/?[a-zA-Z][^\s>\/]*[^>]*\/?>/g;
            let lastIndex = 0;
            let match;
            while ((match = tagRegex.exec(region)) !== null) {
                const tagStart = match.index;
                const tagEnd = tagRegex.lastIndex;
                const tag = match[0];
                let subtype = 'start';
                if (/^<\s*\/.*>$/.test(tag)) subtype = 'end';
                else if (/\/>$/.test(tag)) subtype = 'selfclosing';
                let value = '';
                if (tagStart > lastIndex) value += region.slice(lastIndex, tagStart);
                value += tag;
                if (value.trim().length > 0) {
                    blocks.push({
                        type: 'html',
                        subtype,
                        index: index++,
                        value: value.trim()
                    });
                }
                lastIndex = tagEnd;
            }
            if (lastIndex < region.length) {
                const remain = region.slice(lastIndex).trim();
                if (remain.length > 0) {
                    blocks.push({
                        type: 'html',
                        subtype: 'start',
                        index: index++,
                        value: remain
                    });
                }
            }
        }
        return blocks;
    }

    splitBlocksHUBL(blocksHTML){
        const resultBlocks = [];
        let index = 0;

        for (const block of blocksHTML) {
            if (block.type !== 'html') {
                resultBlocks.push({...block, index: index++});
                continue;
            }

            const value = block.value;

            // If the entire block value is a HubL comment {# ... #}, split into 3 parts and skip further parsing
            if (value.startsWith('{#') && value.endsWith('#}')) {
                const innerContent = value.slice(2, -2).trim();
                resultBlocks.push({
                    type: 'hubl',
                    subtype: 'comment_start',
                    index: index++,
                    value: '{#'
                });
                resultBlocks.push({
                    type: 'hubl',
                    subtype: 'comment_inner',
                    index: index++,
                    value: innerContent
                });
                resultBlocks.push({
                    type: 'hubl',
                    subtype: 'comment_end',
                    index: index++,
                    value: '#}'
                });
                continue;
            }

            // Function to check if position is inside HTML tag (between < and >)
            function isInsideHtmlTag(pos, str) {
                let inside = false;
                for (let i = 0; i < pos; i++) {
                    if (str[i] === '<') inside = true;
                    else if (str[i] === '>') inside = false;
                }
                return inside;
            }

            // Regex to match HubL comment tags {# ... #}
            const hublCommentRegex = /\{#[\s\S]+?#\}/g;

            // First, find all comment ranges and push comment blocks
            const commentRanges = [];
            let m;
            while ((m = hublCommentRegex.exec(value)) !== null) {
                if (!isInsideHtmlTag(m.index, value)) {
                    commentRanges.push({start: m.index, end: m.index + m[0].length, text: m[0]});
                }
            }

            // Push comment blocks for each comment range
            for (const comment of commentRanges) {
                const commentStart = comment.start;
                const commentEnd = comment.end;
                const commentText = comment.text;
                const innerContent = commentText.slice(2, -2).trim();

                resultBlocks.push({
                    type: 'hubl',
                    subtype: 'comment_start',
                    index: index++,
                    value: '{#'
                });
                resultBlocks.push({
                    type: 'hubl',
                    subtype: 'comment_inner',
                    index: index++,
                    value: innerContent
                });
                resultBlocks.push({
                    type: 'hubl',
                    subtype: 'comment_end',
                    index: index++,
                    value: '#}'
                });
            }

            // Function to check if a position is inside any comment range
            function isInsideComment(pos) {
                for (const range of commentRanges) {
                    if (pos >= range.start && pos < range.end) {
                        return true;
                    }
                }
                return false;
            }

            // Regex to match HubL logic tags {% ... %}
            const hublLogicRegex = /\{%\s*[\s\S]+?\s*%\}/g;
            // Regex to match HubL print tags {{ ... }}
            const hublPrintRegex = /\{\{[\s\S]+?\}\}/g;

            // Collect all matches (logic, print) with their type and position
            const matches = [];

            while ((m = hublLogicRegex.exec(value)) !== null) {
                if (!isInsideHtmlTag(m.index, value) && !isInsideComment(m.index)) {
                    const innerContent = m[0].replace(/^\{%\s*|\s*%\}$/g, '').trim();
                    if (innerContent.startsWith('module')) {
                        matches.push({start: m.index, end: m.index + m[0].length, type: 'module', text: m[0]});
                    } else if (innerContent.startsWith('include')) {
                        matches.push({start: m.index, end: m.index + m[0].length, type: 'print', text: m[0]});
                    } else {
                        matches.push({start: m.index, end: m.index + m[0].length, type: getLogicSubtype(m[0]), text: m[0]});
                    }
                }
            }
            while ((m = hublPrintRegex.exec(value)) !== null) {
                if (!isInsideHtmlTag(m.index, value) && !isInsideComment(m.index)) {
                    matches.push({start: m.index, end: m.index + m[0].length, type: 'print', text: m[0]});
                }
            }

            // Helper to determine logic subtype (start or end)
            function getLogicSubtype(value) {
                let inner = value.replace(/^\{%\s*|\s*%\}$/g, '').trim();
                const keyword = inner.split(/\s+/)[0];
                const startKeywords = ['for', 'if', 'macro', 'block','dnd_area','require_js','require_css'];
                const endKeywords = ['endfor', 'endif', 'endmacro', 'endblock','end_dnd_area','end_require_js','end_require_css'];
                if (startKeywords.includes(keyword)) return 'start';
                if (endKeywords.includes(keyword)) return 'end';
                return 'start'; // default to start if unknown
            }

            // Sort matches by start position
            matches.sort((a,b) => a.start - b.start);

            if (matches.length === 0) {
                // No HubL outside HTML tags and comments, push as is
                // But skip if the whole value was already processed as comments
                // Check if entire value is covered by comment ranges
                if (commentRanges.length === 0) {
                    resultBlocks.push({...block, index: index++});
                }
                continue;
            }

            // Now split the value into segments: alternating HTML and HubL blocks
            let lastPos = 0;
            for (let i = 0; i < matches.length; i++) {
                const m = matches[i];
                // HTML block before this HubL block
                if (m.start > lastPos) {
                    const htmlPart = value.slice(lastPos, m.start).trim();
                    if (htmlPart.length > 0) {
                        resultBlocks.push({
                            type: 'html',
                            subtype: block.subtype,
                            index: index++,
                            value: htmlPart
                        });
                    }
                }
                // Push HubL block(s)
                if (m.type === 'comment_start') {
                    resultBlocks.push({
                        type: 'hubl',
                        subtype: 'comment_start',
                        index: index++,
                        value: m.text
                    });
                } else if (m.type === 'comment_inner') {
                    resultBlocks.push({
                        type: 'hubl',
                        subtype: 'comment_inner',
                        index: index++,
                        value: m.text
                    });
                } else if (m.type === 'comment_end') {
                    resultBlocks.push({
                        type: 'hubl',
                        subtype: 'comment_end',
                        index: index++,
                        value: m.text
                    });
                } else {
                    // For other types, just push the block
                    resultBlocks.push({
                        type: 'hubl',
                        subtype: m.type,
                        index: index++,
                        value: m.text
                    });
                }
                lastPos = m.end;
            }
            // Any remaining HTML after last HubL block
            if (lastPos < value.length) {
                const htmlPart = value.slice(lastPos).trim();
                if (htmlPart.length > 0) {
                    resultBlocks.push({
                        type: 'html',
                        subtype: block.subtype,
                        index: index++,
                        value: htmlPart
                    });
                }
            }
        }

        return resultBlocks;
    }

    convertforceselfclosing(){

    }

    tabIndent(blocks) {
        const newBlocks = blocks.map(b => ({...b}));
        let indentLevel = 0;
        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];

        for (const block of newBlocks) {
            if (block.type === 'html') {
                const tagMatch = block.value.match(/^<\s*([a-zA-Z0-9]+)/);
                const tagName = tagMatch ? tagMatch[1].toLowerCase() : null;
                if (block.value.endsWith('/>') || (tagName && selfClosingTags.includes(tagName))) {
                    block.subtype = 'selfclosing';
                }
            }
            if (block.subtype === 'start') {
                block.indentedValue = indentLevel;
                indentLevel++;
            } else if (block.subtype === 'end') {
                indentLevel = Math.max(indentLevel - 1, 0);
                block.indentedValue = indentLevel;
            } else if (block.subtype === 'print' || block.subtype === 'complete') {
                block.indentedValue = indentLevel;
            } else {
                block.indentedValue = indentLevel;
            }
        }

        // Post-processing to merge start + print + end sequences into single selfclosing block
        for (let i = 0; i < newBlocks.length - 2; i++) {
            if (
                newBlocks[i].subtype === 'start' &&
                newBlocks[i + 1].subtype === 'print' &&
                newBlocks[i + 2].subtype === 'end'
            ) {
                newBlocks[i].value = newBlocks[i].value + newBlocks[i + 1].value + newBlocks[i + 2].value;
                newBlocks[i].subtype = 'selfclosing';
                // indentedValue remains the same as newBlocks[i].indentedValue
                newBlocks.splice(i + 1, 2);
                i--; // Adjust index to re-check from previous position
            }
        }

        return newBlocks;
    }

    indentBaseRender(blocks) {
        // For each block, prepend indentation spaces based on indentedValue and this.tab,
        // then join all block values with newlines.
        const tab = this.tab;
        const lines = blocks.map(block => {
            const indent = typeof block.indentedValue === 'number' ? tab.repeat(block.indentedValue) : '';
            return indent + block.value;
        });
        return lines.join('\n');
    }

    formatHTML(content) {
        console.clear();
        const normalizedContent = this.normalizeContent(content);
        const blocksHTML = this.splitBlocksHTML(normalizedContent);
        
        console.log({blocksHTML});

        const blocksHUBL = this.splitBlocksHUBL(blocksHTML);
        console.log({blocksHUBL});

        const formattedContent = this.tabIndent(blocksHUBL);
        console.log({formattedContent});

        const renderedContent = this.indentBaseRender(formattedContent);
        
        
        return renderedContent;
    }
}