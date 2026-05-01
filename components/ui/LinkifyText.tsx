import Linkify from 'linkify-react'

interface LinkifyTextProps {
    children: string
    className?: string
}

export function LinkifyText({ children, className }: LinkifyTextProps) {
    return (
        <Linkify
            options={{
                target: '_blank',
                rel: 'nofollow noopener noreferrer',
                className: 'text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors break-words',
            }}
        >
            <span className={className}>{children}</span>
        </Linkify>
    )
}