import { useEffect } from "react"
import styles from './comment.module.css'

export const Comment = () => {
  useEffect(() => {
    (window as any).twikoo.init({
      envId: 'https://twikoo.blog.udonchan.fun',
      el: '#tcomment',
      lang: 'zh-CN',
      });
  }, [])

  return (
    <div className={styles.comment}>
      <div className={styles.twikoo}>
        <div id='tcomment'></div>
      </div>
    </div>
  )
}
