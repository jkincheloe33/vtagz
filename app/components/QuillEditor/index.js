import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import * as Emoji from 'quill-emoji';
import './quill-editor.styl';
import 'quill-emoji/dist/quill-emoji.css';

Quill.register(
  {
    'modules/emoji': Emoji,
  },
  true
);

const initialModules = {
  toolbar: [
    [
      'bold',
      'italic',
      'underline',
      'emoji',
      'link',
      { list: 'bullet' },
      { list: 'ordered' },
      { align: 'center' },
    ],
  ],
  'emoji-toolbar': true,
  'emoji-shortname': true,
};

export default function QuillEditor({ value, onChange, modules, placeholder }) {
  const ref = useRef(); // store the div that handles closing quill-emoji palette

  // workaround to a bug in quill-emoji package
  // Line 97: https://github.com/contentco/quill-emoji/blob/master/src/module-toolbar-emoji.js
  useEffect(() => {
    let current = ref.current;
    if (current) {
      current.addEventListener('click', closepalette);
    }

    return () => {
      if (current) {
        current.removeEventListener('click', closepalette);
      }
    };
  }, [ref]);

  // sadly we can't access the emoji palette in a more react friendly way
  function closepalette() {
    let ele_emoji_plate = document.getElementById('emoji-palette');
    ref.current.style.display = 'none';
    if (ele_emoji_plate) {
      ele_emoji_plate.remove();
    }
  }

  return (
    <>
      <ReactQuill
        bounds='.quill'
        modules={modules ?? initialModules}
        onChange={onChange}
        placeholder={placeholder}
        theme='snow'
        value={value}
      />
      <div id='emoji-close-div' ref={ref}></div>
    </>
  );
}

QuillEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  modules: PropTypes.object,
  placeholder: PropTypes.string,
};
