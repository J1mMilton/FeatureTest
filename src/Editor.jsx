// Editor.js
import React, { useState, useMemo, useContext, useCallback } from 'react';
import { Editor, EditorState, CompositeDecorator, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Editor.css';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const keywords = ['highlight', 'react', 'draft'];

function findKeywords(contentBlock, callback) {
  const text = contentBlock.getText();
  keywords.forEach((keyword) => {
    let startIndex = 0;
    while (startIndex < text.length) {
      const index = text.toLowerCase().indexOf(keyword.toLowerCase(), startIndex);
      if (index === -1) break;
      callback(index, index + keyword.length);
      startIndex = index + keyword.length;
    }
  });
}

const EditorPage = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Popup state for the clicked word and its position.
  const [popupWord, setPopupWord] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // HighlightSpan now uses useCallback to get access to popup setters.
  const HighlightSpan = useCallback((props) => {
    const handleHighlightClick = (event) => {
      event.stopPropagation();
      // Get the bounding rect of the container for proper positioning.
      const container = document.querySelector('.editor-page');
      if (container) {
        const rect = container.getBoundingClientRect();
        setPopupPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      } else {
        setPopupPosition({ x: event.clientX, y: event.clientY });
      }
      setPopupWord(props.children);
    };
    return (
      <span className="highlight" onClick={handleHighlightClick}>
        {props.children}
      </span>
    );
  }, []);

  const decorator = useMemo(
    () =>
      new CompositeDecorator([
        {
          strategy: findKeywords,
          component: HighlightSpan,
        },
      ]),
    [HighlightSpan]
  );

  const [editorState, setEditorState] = useState(() => {
    const defaultText = "Type something here... Try 'react', 'draft' or 'highlight'.";
    const contentState = ContentState.createFromText(defaultText);
    return EditorState.createWithContent(contentState, decorator);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="editor-page" style={{ position: 'relative' }}>
      <header>
        <h2>Draft.js Clickable Highlighted Editor</h2>
        <div>
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="editorContainer">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Type something here..."
        />
      </div>
      {popupWord && (
        <div
          className="popup"
          style={{ left: popupPosition.x, top: popupPosition.y }}
        >
          <div>You clicked on: "{popupWord}"</div>
          <button onClick={() => setPopupWord(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
