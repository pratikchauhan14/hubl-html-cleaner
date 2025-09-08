import { html as beautifyHtml } from 'js-beautify';

export class HubLFormatter {
    constructor() {
        this.tab = '    '; // 4 spaces
    }

    protectPlaceholders(html) {
        const placeholders = [];
        const protectedHtml = html.replace(/(\{\{[\s\S]*?\}\}|\{%\s*[\s\S]*?\s*%\})/g, (match) => {
            if (match.startsWith('{{')) {
                // Collapse multiline and extra spaces inside {{ ... }} expressions
                // Remove leading/trailing {{ and }}, then process, then re-wrap
                let inner = match.slice(2, -2);
                inner = inner.replace(/[\r\n]+/g, ' '); // replace newlines with space
                inner = inner.replace(/\s+/g, ' '); // collapse multiple spaces
                inner = inner.trim();
                const collapsed = `{{ ${inner} }}`;
                placeholders.push({ type: 'expression', value: collapsed });
                return `__HUBL_EXPR_${placeholders.length - 1}__`;
            } else {
                // Leave HubL tags unchanged
                placeholders.push({ type: 'tag', value: match });
                return `__HUBL_EXPR_${placeholders.length - 1}__`;
            }
        });
        return { html: protectedHtml, placeholders };
    }

    restorePlaceholders(html, placeholders) {
        return html.replace(/__HUBL_EXPR_(\d+)__/g, (_, i) => placeholders[i].value);
    }

    formatHubL(content, baseIndent = 0) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        if (!lines.length) return '';

        const result = [];
        let indentLevel = baseIndent;
        
        // HubL control structure patterns
        const blockStart = /^{%-?\s*(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress|set)\b/;
        const blockEnd = /^{%-?\s*end(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress)\b/;
        const blockMiddle = /^{%-?\s*(else|elif|elsif|elseif)\b/;
        const standalone = /^{%-?\s*(include|import|from|extends|load)\b/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let currentIndent = indentLevel;

            // Handle closing tags - decrease indent first
            if (blockEnd.test(line)) {
                currentIndent = Math.max(0, indentLevel - 1);
                indentLevel = currentIndent;
            }
            // Handle middle blocks (else, elif) - decrease indent temporarily
            else if (blockMiddle.test(line)) {
                currentIndent = Math.max(0, indentLevel - 1);
            }

            // Add the formatted line
            result.push(this.tab.repeat(currentIndent) + line);

            // Handle opening tags - increase indent after adding line
            if (blockStart.test(line) && !standalone.test(line)) {
                indentLevel++;
            }
        }

        return result.join('\n');
    }

    formatHTMLContent(content, baseIndent = 0) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        if (!lines.length) return '';

        const result = [];
        let indentLevel = baseIndent;
        const stack = [];
        
        // HTML element categories
        const selfClosing = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
        const inline = new Set(['a', 'abbr', 'b', 'bdo', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map', 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'var']);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let currentIndent = indentLevel;

            // Check if this is an HTML tag
            const tagMatch = line.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
            
            if (tagMatch) {
                const tagName = tagMatch[1].toLowerCase();
                const isClosing = line.startsWith('</');
                const isSelfClosing = line.endsWith('/>') || selfClosing.has(tagName);
                const isInline = inline.has(tagName);

                if (isClosing) {
                    // Find matching opening tag and close all nested tags
                    let found = false;
                    for (let j = stack.length - 1; j >= 0; j--) {
                        if (stack[j].tagName === tagName) {
                            // Remove all tags from this point
                            const removed = stack.splice(j);
                            indentLevel -= removed.length;
                            found = true;
                            break;
                        }
                    }
                    currentIndent = indentLevel;
                }

                result.push(this.tab.repeat(currentIndent) + line);

                // Handle opening tags
                if (!isClosing && !isSelfClosing && !isInline) {
                    stack.push({ tagName, line: i });
                    indentLevel++;
                }
            } else {
                // Text content
                result.push(this.tab.repeat(currentIndent) + line);
            }
        }

        return result.join('\n');
    }

    async formatJavaScript(content, baseIndent = 0) {
        try {
            const { js: beautifyJs } = await import('js-beautify');
            let formatted = beautifyJs(content, {
                indent_size: 2,
                preserve_newlines: false,
                max_preserve_newlines: 1,
                wrap_line_length: 100,
                end_with_newline: false
            });
            
            // Apply base indentation if needed
            if (baseIndent > 0) {
                const indent = this.tab.repeat(baseIndent);
                formatted = formatted.split('\n')
                    .map(line => line.trim() ? indent + line : line)
                    .join('\n');
            }
            
            return formatted;
        } catch (error) {
            console.error('JavaScript formatting error:', error);
            return content;
        }
    }

    async formatCSS(content, baseIndent = 0) {
        try {
            const { css: beautifyCss } = await import('js-beautify');
            let formatted = beautifyCss(content, {
                indent_size: 2,
                newline_between_rules: true,
                preserve_newlines: false,
                max_preserve_newlines: 1,
                end_with_newline: false
            });
            
            // Apply base indentation if needed
            if (baseIndent > 0) {
                const indent = this.tab.repeat(baseIndent);
                formatted = formatted.split('\n')
                    .map(line => line.trim() ? indent + line : line)
                    .join('\n');
            }
            
            return formatted;
        } catch (error) {
            console.error('CSS formatting error:', error);
            return content;
        }
    }

    normalizeContent(content) {
        // First, normalize multi-line tags and HubL expressions
        let normalized = content;

        // Fix multi-line HTML tags by joining them
        normalized = normalized.replace(/(<[^>]*?)\n([^<]*?>)/g, '$1 $2');
        
        // Fix multi-line HubL tags by joining them
        normalized = normalized.replace(/({%-?\s*)\n(\s*\w+[^%]*?%})/g, '$1$2');
        normalized = normalized.replace(/({%-?[^%]*?)\n(\s*%})/g, '$1 $2');

        // Normalize spacing in HubL tags
        normalized = normalized.replace(/{%-?\s*(\w+)\s+([^%]*?)\s*-?%}/g, (match, keyword, content) => {
            const cleanContent = content.trim();
            return `{% ${keyword}${cleanContent ? ' ' + cleanContent : ''} %}`;
        });

        return normalized;
    }

    async formatHTML(content) {
        if (!content || !content.trim()) return '';
        content = content.trim();

        // Collapse all multi-line and multi-line-split attributes into a single line per tag
        // We'll process each HTML tag and collapse its attributes to a single line
        content = content.replace(/<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>/g, (match, tag, attrs, selfclose) => {
            // Collapse all newlines and excessive whitespace in attributes
            let collapsedAttrs = attrs
                .replace(/[\r\n]+/g, ' ') // collapse newlines
                .replace(/\s+/g, ' ')     // collapse multiple spaces
                .replace(/^\s+|\s+$/g, ''); // trim
            // Further, collapse attribute values' internal whitespace
            collapsedAttrs = collapsedAttrs.replace(/([\w:-]+)=(".*?"|'.*?')/g, (m, attr, val) => {
                if (val[0] === '"' || val[0] === "'") {
                    let v = val.slice(1, -1).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                    if (attr === 'style') {
                        v = v.replace(/\s*:\s*/g, ': ').replace(/;\s*/g, '; ').trim();
                    }
                    if (attr === 'class') {
                        v = v.replace(/\s+/g, ' ').trim();
                    }
                    return `${attr}=${val[0]}${v}${val[0]}`;
                }
                return m;
            });
            return `<${tag}${collapsedAttrs ? ' ' + collapsedAttrs : ''}${selfclose}>`;
        });

        // Handle script and style blocks separately first
        const scriptStyleBlocks = this.extractScriptStyleBlocks(content);
        let processedContent = scriptStyleBlocks.content;

        // Now format the mixed HTML/HubL content as one unified block
        const formatted = await this.formatMixedContent(processedContent);

        // Restore script and style blocks (await the async function)
        let result = await this.restoreScriptStyleBlocks(formatted, scriptStyleBlocks.blocks);

        // Collapse multiple consecutive newlines into a single newline
        result = result.replace(/\n{2,}/g, '\n');
        return result.trim();
    }

    extractScriptStyleBlocks(content) {
        // This method extracts <script>...</script> and <style>...</style> blocks,
        // preserving their internal content exactly (no normalization or splitting).
        const blocks = [];
        let processedContent = content;
        let blockIndex = 0;

        // Helper to extract and replace all blocks of a given tag
        function extractBlocks(tagName, regex, type) {
            processedContent = processedContent.replace(regex, (match) => {
                const placeholder = `__${type.toUpperCase()}_BLOCK_${blockIndex}__`;
                blocks.push({ type, content: match, placeholder });
                blockIndex++;
                return placeholder;
            });
        }

        // Extract <script> blocks (greedy, including all content)
        extractBlocks(
            'script',
            /<script\b[^>]*>[\s\S]*?<\/script>/gi,
            'script'
        );
        // Extract <style> blocks
        extractBlocks(
            'style',
            /<style\b[^>]*>[\s\S]*?<\/style>/gi,
            'style'
        );

        return { content: processedContent, blocks };
    }

    async restoreScriptStyleBlocks(content, blocks) {
        // For each script/style block, reformat the content inside the tags (but do not normalize or split),
        // and protect/restore HubL expressions during JS/CSS formatting.
        let result = content;
        for (const block of blocks) {
            let formattedBlock = '';
            // Extract opening tag, content, and closing tag using regex
            // This regex captures: opening tag, content, closing tag
            let match;
            if (block.type === 'script' || block.type === 'style') {
                // <script ...> ... </script> or <style ...> ... </style>
                const tagRegex = block.type === 'script'
                    ? /^(\s*<script\b[^>]*>)([\s\S]*?)(<\/script>\s*)$/i
                    : /^(\s*<style\b[^>]*>)([\s\S]*?)(<\/style>\s*)$/i;
                match = block.content.match(tagRegex);
                if (match) {
                    const openingTag = match[1];
                    const innerContent = match[2];
                    const closingTag = match[3];
                    // Determine indentation of opening tag for proper indent
                    const openingTagIndentMatch = openingTag.match(/^(\s*)/);
                    const baseIndent = openingTagIndentMatch ? Math.floor(openingTagIndentMatch[1].replace(/\t/g, '    ').length / this.tab.length) : 0;
                    // 1. Protect HubL expressions in innerContent
                    const { html: protectedContent, placeholders } = this.protectPlaceholders(innerContent);
                    // 2. Format JS/CSS with placeholders in place
                    let formattedInner;
                    if (block.type === 'script') {
                        formattedInner = await this.formatJavaScript(protectedContent, baseIndent + 1);
                    } else {
                        formattedInner = await this.formatCSS(protectedContent, baseIndent + 1);
                    }
                    // 3. Restore HubL placeholders after formatting
                    formattedInner = this.restorePlaceholders(formattedInner, placeholders);
                    // Ensure at least one newline after opening tag and before closing tag
                    formattedBlock = `${openingTag}\n${formattedInner}\n${closingTag}`;
                } else {
                    // fallback: just use original
                    formattedBlock = block.content;
                }
            } else {
                formattedBlock = block.content;
            }
            result = result.replace(block.placeholder, formattedBlock);
        }
        return result;
    }

    async formatMixedContent(content) {
        // Use XRegExp for tokenization
        let XRegExp;
        try {
            XRegExp = (await import('xregexp')).default || (await import('xregexp'));
        } catch (e) {
            // fallback if not available (should be installed)
            XRegExp = require('xregexp');
        }
        // Normalize content (collapse multi-line tags and HubL)
        let normalizedContent = this.normalizeContent(content);
        // Collapse multi-line HTML attributes into a single line
        normalizedContent = normalizedContent.replace(
            /<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>/g,
            (match, tag, attrs, selfclose) => {
                let collapsedAttrs = attrs
                    .replace(/[\r\n]+/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/^\s+|\s+$/g, '');
                collapsedAttrs = collapsedAttrs.replace(/([\w:-]+)=(".*?"|'.*?')/g, (m, attr, val) => {
                    if (val[0] === '"' || val[0] === "'") {
                        let v = val.slice(1, -1).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                        if (attr === 'style') {
                            v = v.replace(/\s*:\s*/g, ': ').replace(/;\s*/g, '; ').trim();
                        }
                        if (attr === 'class') {
                            v = v.replace(/\s+/g, ' ').trim();
                        }
                        return `${attr}=${val[0]}${v}${val[0]}`;
                    }
                    return m;
                });
                return `<${tag}${collapsedAttrs ? ' ' + collapsedAttrs : ''}${selfclose}>`;
            }
        );

        // XRegExp patterns for tokenization
        // HubL block: {% ... %}
        const hublBlockPattern = XRegExp('({%-?\\s*[\\s\\S]*?\\s*-?%})', 'g');
        // HubL expression: {{ ... }}
        const hublExprPattern = XRegExp('({{[\\s\\S]*?}})', 'g');
        // HTML tag (single line, after normalization)
        const htmlTagPattern = XRegExp('(<[!/]?[a-zA-Z][\\w:-]*(?:\\s+[^<>]*?)?>)', 'g');
        // For tokenization, we want to match any of the above, or text.

        // Build a master regex to tokenize
        // Order: HubL block, HubL expr, HTML tag, then text fallback
        const masterPattern = XRegExp.union([hublBlockPattern, hublExprPattern, htmlTagPattern], 'g');

        // Tokenize
        let tokens = [];
        let lastIndex = 0;
        let input = normalizedContent;
        XRegExp.forEach(input, masterPattern, (match, i) => {
            // Any text between lastIndex and match.index is a text token
            if (match.index > lastIndex) {
                const text = input.slice(lastIndex, match.index);
                if (text && text.trim().length > 0) {
                    tokens.push({ type: 'text', value: text });
                }
            }
            // What type is this match?
            const val = match[0];
            if (XRegExp.exec(val, hublBlockPattern)) {
                tokens.push({ type: 'hubltag', value: val });
            } else if (XRegExp.exec(val, hublExprPattern)) {
                tokens.push({ type: 'hubltag', value: val });
            } else if (XRegExp.exec(val, htmlTagPattern)) {
                tokens.push({ type: 'htmltag', value: val });
            }
            lastIndex = match.index + val.length;
        });
        // Add final trailing text if any
        if (lastIndex < input.length) {
            const text = input.slice(lastIndex);
            if (text && text.trim().length > 0) {
                tokens.push({ type: 'text', value: text });
            }
        }
        // Filter out empty or whitespace-only text tokens
        tokens = tokens.filter(t => t.type !== 'text' || t.value.trim() !== '');

        // HTML and HubL indent levels
        let htmlIndent = 0;
        let hublIndent = 0;
        const htmlStack = [];
        const hublStack = [];
        const result = [];

        // HTML element categories
        const selfClosing = new Set([
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
        ]);
        const inline = new Set([
            'a', 'abbr', 'b', 'bdo', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label',
            'map', 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'var'
        ]);

        // HubL block start, end, middle, standalone
        const blockStart = XRegExp('^{%-?\\s*(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress|set)\\b');
        const blockEnd = XRegExp('^{%-?\\s*end(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress)\\b');
        const blockMiddle = XRegExp('^{%-?\\s*(else|elif|elsif|elseif)\\b');
        const standalone = XRegExp('^{%-?\\s*(include|import|from|extends|load)\\b');

        // Helper: is this a HubL tag or expression?
        const isHubLTag = (val) =>
            XRegExp.exec(val, hublBlockPattern) || XRegExp.exec(val, hublExprPattern);

        let middleBlockActive = false;
        let middleBlockBaseIndent = 0;
        let middleBlockBaseIndentHtml = 0;
        let middleBlockBaseIndentHubl = 0;
        let lastWasMiddleBlock = false;

        // For special case: proper indent of first nested block-level tag inside a root <div>
        // Track the stack of open block-level tags and their child index
        const blockLevelTags = new Set([
            // Common block-level HTML tags
            'address','article','aside','blockquote','canvas','dd','div','dl','dt','fieldset','figcaption','figure','footer','form','h1','h2','h3','h4','h5','h6','header','hr','li','main','nav','noscript','ol','p','pre','section','table','tfoot','ul','video'
        ]);

        // To track for each open block-level tag: {tagName, childCount}
        const blockStack = [];

        // Always increase htmlIndent immediately after processing an opening tag,
        // so the next sibling/nested element receives correct indentation.
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let currentHtmlIndent = htmlIndent;
            let currentHublIndent = hublIndent;
            let currentIndent;

            // Compute current indentation, considering middle block state
            if (middleBlockActive) {
                currentIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
            } else {
                currentIndent = htmlIndent + hublIndent;
            }

            if (token.type === 'hubltag') {
                const line = token.value.trim();
                // HubL closing block: decrease indent before line
                if (XRegExp.test(line, blockEnd)) {
                    if (hublStack.length > 0) {
                        hublStack.pop();
                        hublIndent = Math.max(0, hublIndent - 1);
                    }
                    // Reset middle block state on closing block
                    middleBlockActive = false;
                    middleBlockBaseIndent = 0;
                    middleBlockBaseIndentHtml = 0;
                    middleBlockBaseIndentHubl = 0;
                    currentHtmlIndent = htmlIndent;
                    currentHublIndent = hublIndent;
                    currentIndent = htmlIndent + hublIndent;
                    lastWasMiddleBlock = false;
                }
                // HubL middle block: set up middle block state
                else if (XRegExp.test(line, blockMiddle)) {
                    if (hublStack.length > 0) {
                        hublStack.pop();
                        hublIndent = Math.max(0, hublIndent - 1);
                    }
                    // Set middle block state
                    middleBlockActive = true;
                    middleBlockBaseIndentHtml = htmlIndent;
                    middleBlockBaseIndentHubl = hublIndent;
                    middleBlockBaseIndent = htmlIndent + hublIndent;
                    currentHtmlIndent = htmlIndent;
                    currentHublIndent = hublIndent;
                    currentIndent = middleBlockBaseIndent;
                    lastWasMiddleBlock = true;
                } else {
                    lastWasMiddleBlock = false;
                }
                result.push(this.tab.repeat(currentIndent) + line);
                // HubL opening block: increase indent after line (but not for standalone tags)
                if (XRegExp.test(line, blockStart) && !XRegExp.test(line, standalone)) {
                    hublStack.push('block');
                    hublIndent++;
                    lastWasMiddleBlock = false;
                }
                // HubL middle block: increase indent after line
                else if (XRegExp.test(line, blockMiddle)) {
                    hublStack.push('middle');
                    hublIndent++;
                }
                // If inside a block-level HTML tag, increment its child count
                if (blockStack.length > 0) {
                    blockStack[blockStack.length - 1].childCount++;
                }
            } else if (token.type === 'htmltag') {
                // HTML tag detection
                const tagMatch = token.value.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
                let effectiveIndent;
                if (middleBlockActive) {
                    effectiveIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
                } else {
                    effectiveIndent = htmlIndent + hublIndent;
                }
                if (tagMatch) {
                    const tagName = tagMatch[1].toLowerCase();
                    const isClosing = token.value.startsWith('</');
                    const isSelfClosingTag = token.value.endsWith('/>') || selfClosing.has(tagName);
                    const isInlineTag = inline.has(tagName);
                    // HTML closing tag: decrease indent before line
                    if (isClosing) {
                        // If closing a block-level tag, pop from blockStack
                        if (blockLevelTags.has(tagName) && blockStack.length > 0 && blockStack[blockStack.length - 1].tagName === tagName) {
                            blockStack.pop();
                        }
                        for (let j = htmlStack.length - 1; j >= 0; j--) {
                            if (htmlStack[j].tagName === tagName) {
                                const removed = htmlStack.splice(j);
                                htmlIndent -= removed.length;
                                htmlIndent = Math.max(0, htmlIndent);
                                break;
                            }
                        }
                        // recalculate indent after popping stack
                        if (middleBlockActive) {
                            effectiveIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
                        } else {
                            effectiveIndent = htmlIndent + hublIndent;
                        }
                        result.push(this.tab.repeat(effectiveIndent) + token.value);
                    } else {
                        // Special case: if this is the first nested block-level tag inside a block-level parent, increase indent by one
                        let extraIndent = 0;
                        if (
                            blockStack.length > 0 &&
                            blockLevelTags.has(tagName) &&
                            !isSelfClosingTag &&
                            !isInlineTag
                        ) {
                            const parent = blockStack[blockStack.length - 1];
                            if (parent.childCount === 0) {
                                // First nested block-level tag: indent one more
                                extraIndent = 1;
                            }
                        }
                        result.push(this.tab.repeat(effectiveIndent + extraIndent) + token.value);
                        if (!isSelfClosingTag && !isInlineTag) {
                            htmlStack.push({ tagName });
                            htmlIndent++;
                            // If this is a block-level tag, push to blockStack and reset its childCount
                            if (blockLevelTags.has(tagName)) {
                                blockStack.push({ tagName, childCount: 0 });
                            }
                            // If inside a block-level parent, increment its child count
                            if (blockStack.length > 1) {
                                // blockStack[blockStack.length-2] is parent
                                blockStack[blockStack.length-2].childCount++;
                            }
                        } else {
                            // If inside a block-level parent, increment its child count
                            if (blockStack.length > 0) {
                                blockStack[blockStack.length-1].childCount++;
                            }
                        }
                    }
                } else {
                    // fallback: just print as text
                    result.push(this.tab.repeat(effectiveIndent) + token.value);
                    // If inside a block-level parent, increment its child count
                    if (blockStack.length > 0) {
                        blockStack[blockStack.length-1].childCount++;
                    }
                }
                lastWasMiddleBlock = false;
            } else if (token.type === 'text') {
                // Split text by newlines, indent each line
                let lines = token.value.split('\n');
                for (let k = 0; k < lines.length; k++) {
                    let txt = lines[k];
                    if (!txt.trim()) continue;
                    let effectiveIndent;
                    if (middleBlockActive) {
                        effectiveIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
                    } else {
                        effectiveIndent = htmlIndent + hublIndent;
                    }
                    result.push(this.tab.repeat(effectiveIndent) + txt.trim());
                    // If inside a block-level parent, increment its child count
                    if (blockStack.length > 0) {
                        blockStack[blockStack.length-1].childCount++;
                    }
                }
                lastWasMiddleBlock = false;
            }
            if (token.type === 'hubltag' && XRegExp.test(token.value.trim(), blockEnd)) {
                middleBlockActive = false;
                middleBlockBaseIndent = 0;
                middleBlockBaseIndentHtml = 0;
                middleBlockBaseIndentHubl = 0;
            }
            if (
                i + 1 < tokens.length &&
                tokens[i + 1].type === 'hubltag' &&
                (XRegExp.test(tokens[i + 1].value.trim(), blockStart) || XRegExp.test(tokens[i + 1].value.trim(), blockMiddle))
            ) {
                middleBlockActive = false;
                middleBlockBaseIndent = 0;
                middleBlockBaseIndentHtml = 0;
                middleBlockBaseIndentHubl = 0;
            }
        }
        // Collapse multiple consecutive newlines into a single newline
        return result.join('\n').replace(/\n{2,}/g, '\n');
    }

    // This method is no longer needed as we handle mixed content in one pass
    // but keeping it for backward compatibility if needed elsewhere
    parseBlocks(content) {
        return [{ type: 'mixed', content: content, indent: 0 }];
    }

    extractBlockContent(fullContent, startTag, endTag) {
        const lines = fullContent.split('\n');
        const contentLines = [];
        let inContent = false;

        for (const line of lines) {
            if (line.trim().includes(startTag)) {
                inContent = true;
                // Extract content after the opening tag if it's on the same line
                const afterTag = line.substring(line.indexOf('>') + 1);
                if (afterTag.trim() && !afterTag.trim().includes(endTag)) {
                    contentLines.push(afterTag);
                }
                continue;
            }
            
            if (line.trim().includes(endTag)) {
                inContent = false;
                // Extract content before the closing tag if it's on the same line
                const beforeTag = line.substring(0, line.indexOf(endTag));
                if (beforeTag.trim()) {
                    contentLines.push(beforeTag);
                }
                break;
            }
            
            if (inContent) {
                contentLines.push(line);
            }
        }

        return contentLines.join('\n');
    }

    wrapInTags(content, startTag, endTag, originalContent) {
        const lines = originalContent.split('\n');
        const openingLine = lines.find(line => line.includes(startTag)) || `${startTag}>`;
        const closingLine = lines.find(line => line.includes(endTag)) || endTag;
        
        if (!content.trim()) {
            return `${openingLine}\n${closingLine}`;
        }
        
        return `${openingLine}\n${content}\n${closingLine}`;
    }
}