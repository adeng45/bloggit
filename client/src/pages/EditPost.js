import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirectHome,setRedirectHome] = useState(false);
  const [redirectPost,setRedirectPost] = useState(false);


  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirectPost(true);
    }
  }

  async function deletePost(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/delete/'+id, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      setRedirectHome(true);
    }
  }

  if (redirectPost) {
    return <Navigate to={'/post/'+id} />
  }

  else if (redirectHome) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      <form onSubmit={updatePost}>
        <input type="title"
              placeholder={'Title'}
              value={title}
              onChange={ev => setTitle(ev.target.value)} />
        <input type="summary"
              placeholder={'Summary'}
              value={summary}
              onChange={ev => setSummary(ev.target.value)} />
        <input type="file"
              onChange={ev => setFiles(ev.target.files)} />
        <Editor onChange={setContent} value={content} />
        <button className="update" style={{marginTop:'5px'}}>Update</button>
      </form>
      <button className="delete" style={{marginTop:'5px'}} onClick={deletePost}>Delete</button>
    </>
  );
}