import { Context } from 'hono'
import { Env } from 'hono'
import Header from '../organisms/Header'
import Menu from '../organisms/Menu'
import Footer from '../organisms/Footer'
import { JSX } from 'hono/jsx/jsx-runtime'

type PageLayoutProps = {
  c: Context<Env, any, {}>
  title: string
  children: JSX.Element | JSX.Element[]
  className?: string
}

export default function PageLayout({ 
  c, 
  title, 
  children,
  className = ''
}: PageLayoutProps) {
  return (
    <div className={`container ${className}`}>
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <Header title={title} />
        </tr>
        <tr>
          <Menu c={c} />
          <td width={600} valign="top">
            <div className="content">
              {children}
            </div>
          </td>
        </tr>
        <tr>
          <Footer />
        </tr>
      </table>
    </div>
  )
}
