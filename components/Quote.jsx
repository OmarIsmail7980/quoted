import Image from "next/image";

const Quote = ({ data }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: "numeric", month: "short", year: "numeric" };

    return date.toLocaleDateString(undefined, options);
  };
  console.log(data);
  return (
    <div className="flex flex-col mb-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-[20px] h-[20px] rounded-full">
            <Image
              src={`${data.photo}`}
              alt="user"
              width={37}
              height={37}
              className="object-contain w-full"
            />
          </div>
          <h4>{data.name}</h4>
        </div>

        <p>{formatDate(data.createdAt.timestampValue)}</p>
      </div>

      <p>{data.quote.stringValue}</p>
      <p className="flex justify-end">-{data.author.stringValue}</p>
    </div>
  );
};

export default Quote;
