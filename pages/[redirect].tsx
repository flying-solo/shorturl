import axios from "axios";
import { useRouter } from "next/router";


const Post = () => {
  const router = useRouter();
  const redirect = router.query.redirect;


  axios
    .get(`/api/redirect`, { params: { redirect } })
    .then((response) => {
      console.log(response.data);
      router.push(response.data);
    })
    .catch((err) => console.log(err));

  return <p>Post: {router.query.redirect}</p>;
};

export default Post;
