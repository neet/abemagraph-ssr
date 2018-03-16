import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as moment from 'moment';

import { Header } from './components/Header';
import Current from './routes/Current';
import { Footer } from './components/Footer';
import { Container } from './components/Container';
import { NotFound } from './routes/NotFound';
import Details from './routes/Details';
import All from './routes/All';
import { Redirect, RouteComponentProps } from 'react-router';
import Search from './routes/Search';

export class Routes extends React.Component<RouteComponentProps<{}>> {
    componentDidUpdate(prevProps: RouteComponentProps<{}>) {
        if (this.props.location !== prevProps.location) {
            const event = document.createEvent('CustomEvent');
            event.initCustomEvent('eventName', false, false, {});
            window.dispatchEvent(event);
        }
    }
    render() {
        return (
            <React.Fragment>
                <Header />
                <Container>
                    <Switch>
                        <Route path='/' exact component={Current} />
                        <Route path='/details/:slotId' exact component={Details} />
                        <Route path='/all/:date?' component={All} />
                        <Route path='/search' component={Search} />
                        <Route component={NotFound} />
                    </Switch>
                    <Footer />
                </Container>
            </React.Fragment>
        );
    }
}