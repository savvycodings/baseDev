import { Link } from '@studio-freight/compono'
import cn from 'clsx'
import s from './footer.module.scss'

export function Footer() {
  return (
    <footer className={cn(s.footer, 'layout-block')}>
      <Link href="savvycoding@radiant.nexus" className="link">
        mail
      </Link>
      <Link href="/contact" className="link">
        contact
      </Link>
      <Link href="https://twitter.com/savvycoding" className="link">
        twitter
      </Link>
    </footer>
  )
}
