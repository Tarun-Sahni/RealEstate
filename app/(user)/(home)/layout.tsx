import Footer from "@/components/user/common/footer"
import Header from "@/components/user/common/header"

export default function HomeLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>

    )
}
