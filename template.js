module.exports = {//내가 만든 module.js에서의 함수를 다른 영역에서 사용하고싶을때 이렇게 씀
    html:
    `
    <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to my Page!</title>
    <style>
      @charset "utf-8";
      @font-face {
        font-family: 'MapoFlowerIsland';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/MapoFlowerIslandA.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
      * {
        box-sizing: border-box;
        font-family: 'MapoFlowerIsland';
      }
      html,
      body {
        margin: 0;
        padding: 0;
      }
      #wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 100%;
        min-height: 100vh;
        background: #192841;
      }
      .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 800px;
        width: 450px;
        border-radius: 35px;
        background: #eee;
        padding: 60px 20px;
      }
      hr {
        border: 1px dashed #000;
        width: 80%;
        color: #000;
      }
      article {
        width: 75%;
        text-align: left;
      }
      article>img {
        display: block;
        max-width: 100%;
        margin: 20px 0;
        transition: all .3s;
      }
      article>img:hover {
        transform: scale(1.1);
      }
      ul {
        margin: 30px 0;
        padding: 0;
        list-style-type: none;
      }
      ul>li {
        font-size: 1.2rem;
        padding: 5px 0;
      }
      a {
        text-decoration: none;
        font-weight: bold;
      }
      a:visited {
        color: #192841;
      }
    </style>
  </head>
  <body>
    <div id="wrap">
      <div class="card">
        <header>
          <h1>Welcome to my Page!</h1>
        </header>
        <hr>
    `,
    getLITag: files => {
      let str = '';
      const list = files.map(e => e.split('.txt')[0]);//새로운 객체를 만들어주는 역할을 하는 map (./data에서 받아온 파일이름 문자열을 .txt라는 것이 올때마다 나눔)
      for (let i = 0; i < list.length; i++) {
        str += `<li><a href="./?title=${list[i]}">${list[i]}</a></li>`;//각각의 list 이름이 하나의 title주소로 가는 태그를 지니게 됨
      }
      return str;
    }
  }