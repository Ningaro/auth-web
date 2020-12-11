function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
}
function setCookie(tag, val){
  document.cookie = encodeURIComponent(tag) + '=' + encodeURIComponent(val);
}
function exit() {
  document.cookie = `user=0; max-age=0`
  document.cookie = `names=0; max-age=0`
  document.cookie = `birthCity=0; max-age=0`
  document.cookie = `birthDate=0; max-age=0`
  document.cookie = `number=0; max-age=0`
  location.replace("/")
}
$(() => {
  const userLogin = getCookie('user')
  const curURI = document.URL
  if (!userLogin && (curURI.includes('/cat.html') || curURI.includes('/settings.html')))
    location.replace("/")
});
