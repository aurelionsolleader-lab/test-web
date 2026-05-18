const fetchUrl = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  console.log(text.substring(0, 1000));
}
fetchUrl("https://robert-leitl.github.io/ferrofluid/dist/?debug=true");
