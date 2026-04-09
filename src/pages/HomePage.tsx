import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  return (
    <div style={{display:"flex",height:"100vh",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
      <h1>SHARK</h1>
      <input placeholder="아이디" />
      <input placeholder="비밀번호" type="password"/>
      <button onClick={()=>setMsg("회원가입 승인대기중입니다.")}>로그인</button>
      <button onClick={()=>nav("/signup")}>회원가입</button>
      <p>{msg}</p>
    </div>
  );
}
