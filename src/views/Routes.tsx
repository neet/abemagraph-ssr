import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Header } from './components/Header';
import Current from './routes/Current';
import { Footer } from './components/Footer';
import { Container } from './components/Container';
import { NotFound } from './routes/NotFound';

export class Routes extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Container>
                    <Switch>
                        <Route path='/' exact component={Current} />
                        <Route component={NotFound} />
                    </Switch>
                    <Footer />
                </Container>
            </div>
        );
    }
}