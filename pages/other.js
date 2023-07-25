import Link from 'next/link';

const OtherPage = () => <Link href="/">Back to Home</Link>;

export const getStaticProps = async () => ({
  props: {},
});

export default OtherPage;
