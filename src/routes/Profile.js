import React, { useState } from "react";
import { authService, dbService } from "fBase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";
// import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();

  const [newDisplayName, setNewDisplayName] = useState(
    userObj.displayName ? userObj.displayName : "유저"
  );

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      refreshUser();
      // photoURL도 나중에 추가해볼 것
      // storage에 프로필 이미지를 저장할 공간을 추가로 또 만들어서 처리
    }
  };

  // query로 firebase에서 사용하는 query로 변환하고 데이터를 정렬
  // where, ordervBy, limit 같은 함수를 사용해 정렬을 할 수 있음
  // const getMyNweets = async () => {
  //   // 콘솔에서 'index.esm2017.js:4380 Uncaught (in promise) FirebaseError:
  //   // The query requires an index. That index is currently building and cannot'
  //   // 링크가 있는 에러가 나오면 링크타고 들어가서 indexes(색인)을 만들어 줘야함 이게 없어서 뜨는 에러
  //   // 쿼리 실행을 위해 필요!!

  //   const q = await query(
  //     collection(dbService, "nweets"),
  //     where("creatorId", "==", userObj.uid), // creatorId값이 같은 데이터만
  //     orderBy("createdAt") // createdAt을 기준으로 정렬
  //   );

  //   const nweets = await getDocs(q);

  //   console.log(nweets.docs.map((doc) => doc.data()));
  // };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display nmame"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
