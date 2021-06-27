import Document, { Html, Head, Main, NextScript } from 'next/document'
import cookies from 'next-cookies'

interface ExtendedDocumentProps {
  theme: string
}

class MyDocument extends Document<ExtendedDocumentProps> {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    const { theme: themeStore } = cookies(ctx, {
      doNotParse: true,
    })

    let theme = ''

    try {
      theme =
        themeStore && typeof themeStore === 'string'
          ? JSON.parse(themeStore)?.state?.theme
          : ''
      // eslint-disable-next-line no-empty
    } catch (err) {}

    return {
      ...initialProps,
      theme,
    }
  }

  render() {
    const { theme } = this.props
    return (
      <Html>
        <Head />
        <body className={theme}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
