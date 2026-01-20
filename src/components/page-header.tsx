interface PageHeaderProps {
    title: string;
    backgroundImage: string;
}

export default function PageHeader({ title, backgroundImage }: PageHeaderProps) {
    return (
        <div
            className="justify-center items-center bg-center bg-cover flex-row flex"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
            <div className="w-full h-full bg-extra justify-center items-center flex-row flex">
                <div className="section-padding w-full h-full" style={{ background: 'linear-gradient(180deg, rgba(135, 0, 66, 0.75) 0%, rgba(135, 0, 66, 0.75) 50%, #131313 100%)' }}>
                    <h1 className="text-center text-big">{title}</h1>
                </div>
            </div>
        </div>
    );
}
