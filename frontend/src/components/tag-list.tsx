import { Category } from "@/lib/types";

export function TagList({ tags, rows }: { tags: Category[], rows: number }) {

  const totalTags = rows * 3;
  const displayedTags = tags.slice(0, totalTags);

  const groupedTags = []
  for (let i = 0; i < displayedTags.length; i+=3) {
    groupedTags.push(displayedTags.slice(i, i+3));
  }

  return (
    <div>
      {groupedTags.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-start items-center w-full space-x-1.5 overflow-hidden">
          {row.map((tag) => (
            <div key={tag.id} className="bg-primary text-white p-1 rounded-lg">
              {tag.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  )

}