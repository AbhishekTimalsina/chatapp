import Link from "next/link";

export default function RoomSidebar({ roomId, allUsers, username }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link className="text-xl font-bold" href="/">
          Home
        </Link>
      </div>
      <div className="p-4">
        <div className="text-lg font-medium">Room ID: {roomId}</div>
      </div>
      <div className="h-full">
        <h1 className="text-xl font-bold text-center">
          All Members ({allUsers.length})
        </h1>

        <ul className="flex flex-col mt-2 gap-2 h-[60%] overflow-y-auto">
          <li className="pl-2 py-2 bg-green-200 w-[90%] mx-auto rounded ">
            {username} (You)
          </li>

          {allUsers
            .filter((el) => el.username !== username)
            .map((el) => (
              <li
                className="pl-2 py-2 bg-gray-100 w-[90%] mx-auto rounded"
                key={el.id}
              >
                {el.username}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
