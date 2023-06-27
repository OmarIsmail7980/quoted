import { useAuth } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/util/formatDate";

const Quote = ({ data, handleDelete }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2 mb-5 p-3 rounded-lg border border-gray-300 shadow-lg">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
            <Image
              src={`${data.photo}`}
              alt="user"
              width={37}
              height={37}
              className="object-cover w-full h-full"
            />
          </div>
          <h4 className="flex items-center">{data.name}</h4>
          <p className="flex items-center text-[12px] pt-1">
            {formatDate(data.createdAt.timestampValue)}
          </p>
        </div>
      </div>

      <p className="">{data.quote.stringValue}</p>
      <div className="">
        <p className="flex justify-end">-{data.author.stringValue}</p>
      </div>

      <div>
        {user && user.uid === data.uid.stringValue && (
          <div className="flex justify-end gap-4 mt-1">
            <button
              className="text-bold text-[#ED6368] flex items-center gap-2"
              onClick={() => {
                handleDelete(data.id);
              }}
            >
              <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                  fill="#ED6368"
                />
              </svg>
              Delete
            </button>

            <Link
              className="text-bold flex items-center gap-2"
              href={{
                pathname: "/create-quote",
                query: {
                  doc: JSON.stringify({
                    author: data.author.stringValue,
                    quote: data.quote.stringValue,
                    id: data.id,
                  }),
                },
              }}
            >
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                  fill="#000"
                />
              </svg>
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quote;
