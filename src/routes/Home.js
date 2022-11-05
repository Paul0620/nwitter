import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  // 데이터 가져오기 ->  오래된 방식?
  // const getNweets = async () => {
  //   const dbNweets = await getDocs(collection(dbService, "nweets"));
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };

  //     setNweets((prev) => [nweetObject, ...prev]);
  //   });
  // };

  useEffect(() => {
    // getNweets();
    // snapshot을 통해 데이터 가져오기 -> re-render를 하지 않음
    // 실시간 업데이트
    onSnapshot(collection(dbService, "nweets"), (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";

    if (nweet.length === 0) {
      alert("내용을 넣어주세요");
      return;
    }

    // 이미지를 첨부할 때
    if (attachment !== "") {
      // 폴더만들기, 유저 uid와 uuid를 통한 고유 식별을 통해 폴더 구분(폴더 이름)
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      // 데이터 업로드 uploadString(만든 폴더 ref, 이미지 url, 데이터 형식)
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );

      // uploadString시 return 값을 통해 이미지 다운로드
      attachmentUrl = await getDownloadURL(response.ref);
    }

    // // 콜렉션 생성(테이블)
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    // 데이터 생성
    await addDoc(collection(dbService, "nweets"), nweetObj);

    // 초기화
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];

    // 파일리더 api를 활용하여 파일 이름 읽기
    const reader = new FileReader();
    // 1. 파일 읽기
    reader.readAsDataURL(theFile);
    // 2. 파일 읽기가 끝나면 이벤트 발생 -> target안에 result값에 이미지 주소값이 존대
    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;

      setAttachment(result);
    };
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          onChange={onChange}
          placeholder="What's on your min?"
          maxLength={120}
        />
        {/* 
          accept은 서버로 업로드할 수 있는 파일의 타입을 명시하기 위해 사용
          ex) image/*, video/*, audio/* or 파일확장자 -> .png, .jpg 등으로 표현
        */}
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" heigth="50px" alt="preview" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>

      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
