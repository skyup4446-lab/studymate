// 가입 폼을 제출하면 환영 메시지를 보여줘요 (실제로 저장되지는 않는 샘플이에요)
const form = document.getElementById('signup-form');
const message = document.getElementById('message');

form.addEventListener('submit', function (event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막아요

  const name = document.getElementById('name').value;
  message.textContent = name + '님, 가입해 주셔서 감사합니다! 🎉';
  form.reset(); // 입력칸 비우기
});
