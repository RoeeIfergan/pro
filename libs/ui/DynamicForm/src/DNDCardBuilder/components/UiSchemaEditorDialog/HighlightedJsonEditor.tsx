import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Box, useTheme, alpha, createTheme, ThemeProvider } from '@mui/material'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { prefixer } from 'stylis'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'

// Create LTR cache without RTL plugin to override the app-level RTL cache
const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer] // Only prefixer, no RTL plugin
})

const jsonEditorTheme = createTheme({
  direction: 'ltr'
})
// Register only the JSON language to keep bundle size small
hljs.registerLanguage('json', json)

export interface HighlightedJsonEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  className?: string
}

const HighlightedJsonEditor: React.FC<HighlightedJsonEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  error = false,
  disabled = false,
  className
}) => {
  const theme = useTheme()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLElement>(null)
  const [highlightedCode, setHighlightedCode] = useState('')

  // Update highlighted code whenever value changes
  useEffect(() => {
    if (value) {
      try {
        const highlighted = hljs.highlight(value, { language: 'json' }).value
        setHighlightedCode(highlighted)
      } catch {
        // Fallback to plain text if highlighting fails
        setHighlightedCode(value)
      }
    } else {
      setHighlightedCode('')
    }
  }, [value])

  // Handle textarea changes
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value)
    },
    [onChange]
  )

  // Sync scroll between textarea and highlight overlay
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  const containerStyles = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '200px',
    border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      borderColor: error ? theme.palette.error.main : theme.palette.text.primary
    },
    '&:focus-within': {
      borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
      borderWidth: 2
    },
    // Dark scrollbar styling
    '& *': {
      scrollbarWidth: 'thin',
      scrollbarColor: `${theme.palette.divider} ${theme.palette.background.paper}`
    },
    '& *::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '& *::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px'
    },
    '& *::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.divider,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: theme.palette.text.secondary
      }
    },
    '& *::-webkit-scrollbar-corner': {
      backgroundColor: theme.palette.background.paper
    }
  }

  const baseTextStyles = {
    fontFamily:
      '"Fira Code", "JetBrains Mono", "Source Code Pro", Consolas, "Courier New", monospace',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    padding: theme.spacing(1.5),
    margin: 0,
    border: 'none',
    outline: 'none',
    resize: 'none' as const,
    whiteSpace: 'pre' as const,
    overflowWrap: 'normal' as const,
    wordBreak: 'normal' as const,
    tabSize: 2,
    direction: 'ltr' as const,
    textAlign: 'left' as const
  }

  const textareaStyles = {
    ...baseTextStyles,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: 'transparent',
    caretColor: theme.palette.text.primary,
    backgroundColor: 'transparent',
    zIndex: 2
  }

  const highlightStyles = {
    ...baseTextStyles,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    pointerEvents: 'none' as const,
    overflow: 'hidden',
    zIndex: 1,
    '& .hljs': {
      background: 'transparent !important',
      padding: '0 !important',
      color: 'inherit'
    },
    '& .hljs-string': {
      color: theme.palette.mode === 'dark' ? '#98c379' : '#032f62'
    },
    '& .hljs-number, & .hljs-literal': {
      color: theme.palette.mode === 'dark' ? '#d19a66' : '#005cc5'
    },
    '& .hljs-attr': {
      color: theme.palette.mode === 'dark' ? '#e06c75' : '#e3116c'
    },
    '& .hljs-punctuation': {
      color: theme.palette.text.secondary
    }
  }

  return (
    <CacheProvider value={cacheLtr}>
      <ThemeProvider theme={jsonEditorTheme}>
        <Box className={className} sx={containerStyles}>
          {/* Syntax highlighted overlay */}
          <Box
            component='pre'
            ref={highlightRef}
            sx={highlightStyles}
            dangerouslySetInnerHTML={{
              __html:
                highlightedCode ||
                (placeholder && !value
                  ? `<span style="color: ${alpha(theme.palette.text.primary, 0.6)}">${placeholder}</span>`
                  : '')
            }}
          />

          {/* Transparent textarea for input */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // Dark scrollbar styling for textarea wrapper
              '& textarea': {
                scrollbarWidth: 'thin',
                scrollbarColor: `${theme.palette.divider} ${theme.palette.background.paper}`,
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.divider,
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: theme.palette.text.secondary
                  }
                },
                '&::-webkit-scrollbar-corner': {
                  backgroundColor: theme.palette.background.paper
                }
              }
            }}
          >
            <textarea
              dir='ltr'
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onScroll={handleScroll}
              disabled={disabled}
              style={textareaStyles}
              placeholder=''
              spellCheck={false}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
            />
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default HighlightedJsonEditor
