import React from 'react';
import Card from '../shared/components/UIElements/Card';
import './PageDemo.css';

function PageDemo() {
  return (
    <div className="container">
      <h1>Welcome to ShareFrame</h1>
      <p>Explore the features with ShareFrame:</p>

      <Card>
        <h2>Image Gallery</h2>
        <Card>
            <p>View a collection of uploaded images.</p>
            <p>ShareFrame allows you to browse through a variety of images uploaded by users. Discover stunning photography and visual content from around the world.</p>
        </Card>
      </Card>

      <Card>
        <h2>React to your favorite posts</h2>
        <Card>
            <p>Express your appreciation for posts you enjoy.</p>
            <p>With ShareFrame, you can react to your favorite posts with likes, comments, and shares. Show your support and engage with the community.</p>
        </Card>
      </Card>

      <Card>
        <h2>Write some thoughts on posts</h2>
        <Card>
            <p>Share your opinions and feedback.</p>
            <p>Join the conversation by sharing your thoughts on posts. Write comments, provide feedback, and engage in meaningful discussions with other users.</p>
        </Card>
      </Card>

      <Card>
        <h2>Upload your favorite images and places</h2>
        <Card>
            <p>Share your favorite memories and experiences.</p>
            <p>Upload your favorite images and places to ShareFrame. Whether it's breathtaking landscapes, cherished moments, or travel adventures, share your stories visually.</p>
        </Card>
      </Card>

      <Card>
        <h2>Connect and share with people around the world</h2>
        <Card>
            <p>Connect with a global community of users.</p>
            <p>ShareFrame brings people together from all corners of the globe. Connect with like-minded individuals, discover new perspectives, and share your experiences with the world.</p>
        </Card>
      </Card>

      <footer>
        <p>&copy; {new Date().getFullYear()} ShareFrame. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PageDemo;
