import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Header } from './components/Header';
import Current from './routes/Current';
import { Footer } from './components/Footer';
import { Container } from './components/Container';

export class Routes extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Container>
                    <Switch>
                        <Route path='/' exact component={Current} />
                    </Switch>
                    <Footer />
                </Container>
            </div>
        );
    }
}