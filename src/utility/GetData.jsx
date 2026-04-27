const GetData = ({ url }) => {
  const link = `https://teksversity.s3.us-east-1.amazonaws.com/website/assets${url}`;
  return link;
};
 
export default GetData;
