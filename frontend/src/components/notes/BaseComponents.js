import { Editor, useSlate } from 'slate-react'
import React, { forwardRef } from 'react'

const Icon = forwardRef(({ className, ...props }, ref) => {
  <span
    {...props}
    ref={ref}
    className={`material-icons ${className}`}
    style='font-size:18px;vertical-align:text-bottom;'
  />
})

const Button = forwardRef(({ className, active, reversed, ...props }, ref) => {
  const buttonColor = (
    reversed
      ? active
        ? 'white'
        : '#aaa'
      : active
        ? 'black'
        : '#ccc'
  )
  
  return (
    <span
      {...props}
      ref={ref}
      className={`${className}`}
      style={`cursor:pointer;color:${buttonColor}`}
    />
  );
})

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  
  return marks ? marks[format] === true : false;
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)
  
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const Menu = forwardRef(({ className, ...props }, ref) => {
  <div
    {...props}
    ref={ref}
    className={className}
    style='display: inline-block; margin-left: 15px;'
  />
})

export const Toolbar = forwardRef(({ className, ...props }, ref) => {
  <Menu
    {...props}
    ref={ref}
    className={className}
    style={
      'position: relative; padding: 1px 18px 17px;'
      + 'margin: 0 -20px; border-bottom: 2px solid #eee; margin-bottom: 20px;'
    }
  />
})

export function MarkButton({ format, icon }) {
  const editor = useSlate()

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
}