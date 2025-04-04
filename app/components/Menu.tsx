import { Context } from 'hono';
import { Env } from 'hono';

type MenuProps = {
  c: Context<Env, any, {}>;
}

export default async function Menu({ c }: MenuProps) {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');

  return (
    <>
      <div className="menu-header">メニュー</div>
      <div className="menu-item"><a href="/">ホームページ</a></div>
      <div className="menu-item"><a href="/accounts">リンク集</a></div>
      <div className="menu-item"><a href="/products">プロダクト</a></div>
      {visitorsCount && (
        <div className="counter">
          <div>訪問者数:</div>
          <div className="counter-number">{visitorsCount.padStart(8, '0')}</div>
          <div className="kiriban-notice">キリ番の人は掲示板にカキコして下さい！素通り禁止！！</div>
        </div>
      )}
    </>
  )
}
