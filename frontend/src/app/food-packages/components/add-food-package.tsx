import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
 

export const AddFoodPackageDialog = ({addFoodPackage}: {addFoodPackage: (name:string) => void}) => {
    const foodPackageName = React.useRef<HTMLInputElement>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="mb-10 w-64">Add new food package</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add food package</DialogTitle>
          <DialogDescription>
            Add new food package
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Food package name
            </Label>
            <Input
              ref={foodPackageName}
              id="name"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
          <Button  onClick={() => addFoodPackage(foodPackageName.current?.value || "")}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
