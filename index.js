const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./template');//사용자 지정 모듈

http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);//url.parse : url 문자열을 url 객체로 변환하여 return함
  //true : url 객체의 query 속성을 객체 형식으로 가져옴 <-> false : url 객체의 query 속성을 문자열 형식으로 가져옴.
  const pathName = urlObj.pathname;//만들어진 url객체에 담겨져있는 path네임 불러옴
  if (pathName === '/') {
    if (!urlObj.search) {//search는 url에서 ?뒤의 내용을 말하는데 그것이 없을 때
      fs.readdir('./data', 'utf8', (err, files) => {//fs모듈:node의 빌트인 모듈. get,post,put,patch,delete등으로 파일,디렉토리 건들 수 있음
        if (err) throw err;
        const list = template.getLITag(files);//template에서 files을 인자로 받는 getLITag함수를 사용해서 list라는 상수를 만들겠다.
        res.writeHead(200);//200코드는 OK로 받았다는 뜻.헤더를 만듦 = 응답 전송 준비가 됐다는 것을 의미
        res.write(template.html);//template에서 html라는 함수를 불러와서 쓰겠다.
        res.write(`
      <article>
        <img src="https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg">
        <ul>
          <!-- 목록이 들어갈 자리-->
          ${list} <!-- 이런 꼴로 써주면 가변적인 배열이 들어갈 수 있음 -위에 만든 list -->
        </ul>
        <a href="/create">글 작성하기</a> <!--create라는 링크를 가진 '글작성하기-->
      </article>
    </div>
  </div>
</body>
</html>
        `);//여기까지는 html 보여지는 이미지 설정
        res.end();//응답 종료
      });
    } else {//물음표 뒤에 뭔가가 값이 왔을 때.
      console.log(urlObj.query); // query문이라는 것이 ?뒤의 내용을 뜻하므로 title정보가 찍히게 됨.
      fs.readFile(`./data/${urlObj.query.title}.txt`, 'utf8', (err2, data) => {//파일내용 불러오고싶을때는 (err,data)콜백함수 국룰
        if (err2) throw err2;
        const title = urlObj.query.title;//title이라는 상수에 현재 query에 해당되는 title을 담음
        res.writeHead(200);
        res.write(template.html);//꾸며주는 것은 전과 같음
        res.end(`
      <article>
        <h2>${title}</h2>
        <p>
          ${data} <!--readfile에서 인자로 갖고 들어온 data를 써줌-->
        </p>
        <a href="/">홈으로 가기</a> <!--홈으로 가기 누르면 홈으로 감-->
        <p>
          <a href="/update?title=${encodeURIComponent(title)}">수정</a>
          <form action="/delete_post" method="post">
            <input type="hidden" name="title" value="${encodeURIComponent(title)}"><!--title을 새롭게 encoding해서 title이라는 이름으로 deletepost로 던져주기-->
            <input type="submit" value="삭제">
          </form>
        </p>
      </article>
    </div>
  </div>
</body>
</html>
      `);
      });
    }
  } else if (pathName === '/create') { //pathname이 단지 '/'이 아닌 경우-create
    res.writeHead(200, { 'Content-Type': 'text/html' }); //글을 쓸 것이기 때문에 content-type도 정해줘야 함
    res.write(template.html);
    res.write(`
      <article>
        <img src="https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg">
        <form action="/create_post" method="post"> <!--create_post라는 곳으로 넘겨주는 form 설정-->
          <p>
            <label for="title"> 제목 </label>
            <input type="text" id="title" name="title">  
          </p>
          <textarea name="content">
          </textarea>
          <p>
            <input type="submit">
          </p>
        </form>
      </article>
    </div>
  </div>
</body>
</html>
    `);
    res.end();
  } else if (pathName === '/create_post') { // pathname이 create_post인 경우
    let body = '';
    req.on('data', chunk => body += chunk); //post요청을 받아들일 때 req.on씀. 새로운 data를 chuck에 저장
    req.on('end', () => {
      const post = qs.parse(body);//querystring모듈은 url모듈과 같이 쓰이며 우리가 post에서 설정했던 변수들을 갖고와준다.
      const title = post.title; //설정변수 1
      const content = post.content; //설정변수 2
      fs.writeFile(`./data/${title}.txt`, content, 'utf8', () => { //title.txt에 content라는 내용을 가진 것을 utf8형식으로 쓴다.
        res.writeHead(302, {Location: `/?title=${title}`}); //302:브라우저에게 페이지를 이동시키라고 명령.
        res.end();
      });
    });
  } else if (pathName === '/update') { //pathname이 update인 경우
    fs.readFile(`./data/${urlObj.query.title}.txt`, 'utf8', (err, data) => {
      if (err) throw err;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(template.html);
      res.write(`
      <article>
        <img src="https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg">
        <form action="/update_post" method="post">
          <p>
            <input type="hidden" name="original_title" value="${urlObj.query.title}">
            <label for="title"> 제목 </label>
            <input type="text" id="title" name="title" value="${urlObj.query.title}">  
          </p>
          <textarea name="content">
            ${data}
          </textarea>
          <p>
            <input type="submit">
          </p>
        </form>
      </article>
    </div>
  </div>
</body>
</html>
    `);
      res.end();
    });
  } else if (pathName === '/update_post') { //pathname이 update_post인 경우
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const post = qs.parse(body);
      const title = post.title;
      const original_title = post.original_title;
      if (title !== original_title) { //새로 update한 타이틀이 기존의 title과 다르다면
        fs.unlink(`./data/${original_title}.txt`, () => { //기존에 있던 링크를 지워줌(unlink)-fs모듈의 일
          //code
        });
      }
      const content = post.content; //content를 새로 업데이트
      fs.writeFile(`./data/${title}.txt`, content, 'utf8', () => { //이부분은 create랑 동일
        res.writeHead(302, {Location: `/?title=${encodeURIComponent(title)}`});//넘겨줄때 한글제목은 encodeURIComponent로 넘겨줘야 잘 됨.
        res.end();
      });
    });
  } else if (pathName === '/delete_post') { //pathname 이 delete_post인 경우
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const post = qs.parse(body);
      console.log(post);
      fs.unlink(decodeURIComponent(`./data/${post.title}.txt`), () => { //아까 encode시켰던것을 다시 decode하면서 unlink
        res.writeHead(302, {Location: '/'}); //홈으로 강제로 이동
        res.end();
      });
    })
  } else {
    res.writeHead(404); //pathname이 위의 어떤 것에도 해당하지 않는다면 404라는 오류헤더를 띄울 것임
    res.end();
  }
}).listen(3000);