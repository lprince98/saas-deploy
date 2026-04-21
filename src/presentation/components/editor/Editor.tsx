'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'

interface EditorProps {
  initialContent: any
  onUpdate: (content: any) => void
}

/**
 * Tiptap 기반의 프리미엄 리치 텍스트 에디터
 * 디자인 목업의 에디토리얼 스타일을 구현합니다.
 */
export function Editor({ initialContent, onUpdate }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '당신의 사유를 기록하세요...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] text-lg leading-relaxed text-[#4a626d]',
      },
    },
  })

  // hydration mismatch 방지
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !editor) {
    return (
      <div className="animate-pulse bg-slate-50 h-[500px] rounded-xl flex items-center justify-center">
        <span className="text-slate-300">에디터를 준비 중입니다...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Custom Toolbar (Design Matching) */}
      <div className="flex items-center gap-1 mb-8 p-1 bg-[#f2f4f7] rounded-xl border border-slate-200/50 w-fit sticky top-0 z-20 backdrop-blur-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-[#24389c] text-white' : 'hover:bg-slate-200 text-slate-500'}`}
          title="굵게"
        >
          <span className="material-symbols-outlined text-[20px]">format_bold</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-[#24389c] text-white' : 'hover:bg-slate-200 text-slate-500'}`}
          title="기울임꼴"
        >
          <span className="material-symbols-outlined text-[20px]">format_italic</span>
        </button>
        <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-[#24389c] text-white' : 'hover:bg-slate-200 text-slate-500'}`}
          title="글머리 기호"
        >
          <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-[#24389c] text-white' : 'hover:bg-slate-200 text-slate-500'}`}
          title="인용구"
        >
          <span className="material-symbols-outlined text-[20px]">format_quote</span>
        </button>
        <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500" title="이미지 삽입">
          <span className="material-symbols-outlined text-[20px]">image</span>
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
