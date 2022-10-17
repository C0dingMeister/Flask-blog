import React,{useState} from 'react'
import UserNavBar from '../UserNavBar';
import Feed from '../Feed';
import { Container, Stack } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ExplorePage from './ExplorePage';
import BookmarkedPostPage from './BookmarkedPostPage';

function UserPage() {
  const [key, setKey] = useState('feed');


  return (
    <>
      <Container>
        <Stack className="UserSideBar" direction='vertical' gap={4}>
          <UserNavBar />
          <Container className="feed">
            <Tabs
              id="controlled-tab"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="feed" title="Feed">
                <Feed />
              </Tab>
              <Tab eventKey="explore" title="Explore">
               <ExplorePage />
              </Tab>
              <Tab eventKey="favorites" title="Bookmarked">
               <BookmarkedPostPage />
              </Tab>
            </Tabs>
          </Container>
        </Stack>
      </Container>
    </>
  );
}

export default UserPage