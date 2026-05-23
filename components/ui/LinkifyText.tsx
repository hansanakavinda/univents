import Linkify from 'linkify-react'
import React from 'react'

interface LinkifyTextProps {
    children: string
    className?: string
}

function parseWhatsAppFormatting(text: string) {
    // Match URLs first, so they aren't split by formatting rules. 
    // Then match *, _, ~, and # tags.
    const regex = /(https?:\/\/[^\s]+|www\.[^\s]+|\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|(?<=^|\s)#[a-zA-Z0-9_]+)/g;
    const tokens = text.split(regex);

    return tokens.map((token, i) => {
        if (!token) return null;

        // If it's a URL, return as-is. Linkify-react will handle it.
        if (token.startsWith('http://') || token.startsWith('https://') || token.startsWith('www.')) {
            return token;
        }

        if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
            return <strong key={i} className="font-bold">{parseWhatsAppFormatting(token.slice(1, -1))}</strong>;
        }
        if (token.startsWith('_') && token.endsWith('_') && token.length > 2) {
            return <em key={i} className="italic">{parseWhatsAppFormatting(token.slice(1, -1))}</em>;
        }
        if (token.startsWith('~') && token.endsWith('~') && token.length > 2) {
            return <del key={i} className="line-through">{parseWhatsAppFormatting(token.slice(1, -1))}</del>;
        }
        if (token.startsWith('#') && token.length > 1) {
            return <span key={i} className="text-primary hover:text-primary-hover font-semibold cursor-pointer transition-colors">{token}</span>;
        }
        return token;
    });
}

export function LinkifyText({ children, className }: LinkifyTextProps) {
    if (!children) return null;

    return (
        <Linkify
            options={{
                target: '_blank',
                rel: 'nofollow noopener noreferrer',
                className: 'text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors break-words',
            }}
        >
            <span className={className}>{parseWhatsAppFormatting(children)}</span>
        </Linkify>
    )
}