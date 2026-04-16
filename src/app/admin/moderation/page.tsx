import { getUnapprovedPhotos } from "@/app/actions/adminActions";
import MemberPhotos from "@/components/MemberPhotos";
import { Divider } from "@heroui/react";

export default async function PhotoModerationPage() {

  const photos = await getUnapprovedPhotos();

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-2xl'>Photo Awaiting Moderation</h3>
      <Divider />
      <MemberPhotos photos={photos} />
    </div>
  )
}