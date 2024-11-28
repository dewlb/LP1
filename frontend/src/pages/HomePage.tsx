import './HomePage.css';
import footballCelebration from '../assets/background_basketball.jpg';
import Navbar from '../components/Navbar';

function HomePage()
{
    return(
        <>
        <Navbar />
           <div className='container'>
                <h1>Ready?</h1>
                <h1>Set?</h1>
                <a href='https://github.com/dewlb/LP1' className='plan'><h1>Plan.</h1> </a>
                
                
           </div>

           <h3 className='slogan'>Create your tournament today.</h3>

           <img className="page_img" src = {footballCelebration} />
        </>
    );
}

export default HomePage