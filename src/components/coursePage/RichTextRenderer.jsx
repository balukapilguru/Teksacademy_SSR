import Link from "next/link";

const RichTextRenderer = ({ content = [] }) => {
  return (
    <>
      {content.map((item, index) => {
        if (item.type === "text") {
          return <span key={index}>{item.value}</span>;
        }

        if (item.type === "link") {
          const isInternal =
            item.url.startsWith("/") ||
            item.url.includes("teksversity.com");

          // Convert absolute internal URL to relative
          const href = item.url.replace("https://teksversity.com", "");

          return isInternal ? (
            <Link
              key={index}
              href={href}
              className="text-[#012a7f] font-medium  hover:text-[#ea6329]"
            >
              {item.value}
            </Link>
          ) : (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#012a7f] font-medium  hover:text-[#ea6329]"
            >
              {item.value}
            </a>
          );
        }

        return null;
      })}
    </>
  );
};

export default RichTextRenderer;
