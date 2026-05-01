const GetData = ({ url }) => {
  // Remove the leading slash from url if it exists to avoid double slashes
  const cleanUrl = url?.startsWith('/') ? url.substring(1) : url;
  const link = `https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/${cleanUrl}`;
  return link;
};

export default GetData;