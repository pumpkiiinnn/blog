import { AvatarImage } from '@/components/blocks/avatar/image'
import { Block } from '@/components/blocks/block'
import { Wave } from '@/components/wave'

export const Avatar = () => {
  return (
    <Block
      className='bg-gradient-to-b from-blue-300 to-blue-50 p-0 dark:from-blue-400/60'
      data-type='about'
    >
      <Wave />
      <AvatarImage />
    </Block>
  )
}
