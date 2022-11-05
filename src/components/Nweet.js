import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  // 삭제, 수정 -> doc(getFirestore()을 담은 변수, 콜렉션 명, 데이터 id값)
  const nweetDoc = doc(dbService, "nweets", nweetObj.id);

  // 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");

    if (ok) {
      // 삭제
      await deleteDoc(nweetDoc);
      // storage에 이미지 삭제
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    }
  };

  // 수정폼 or 리스트
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  // 수정 제출
  const onSubmit = async (event) => {
    event.preventDefault();

    await updateDoc(nweetDoc, { text: newNweet });

    setEditing(false);
  };

  // 수정
  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="수정"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="newNweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt=""
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
