import React, { Component } from 'react';
import {
    Dimensions,       // Detects screen dimensions
    Platform,         // Detects platform running the app
    ScrollView,       // Handles navigation between screens
    StyleSheet,       // CSS-like styles
    View,           // Container component
    Image
} from 'react-native';
import Button from './button';
import { colors } from '../colors'
import ContactsPermission from '../screens/firstAlbum/ContactsPermission'
import { connect } from 'react-redux';
import { setPopupContactsPermission, setPopupBegin } from '../redux/user/userActions'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Detect screen width and height
const { width, height } = Dimensions.get('window');
class OnboardingScreens extends Component {

    // componentDidMount() {
    //     (async () => {
    //       const walked = await AsyncStorage.getItem('walkedThrough')
    //       
    //       if(walked === 'yes' ) this.props.navigation.navigate('Signin');
    //     })()
    //   }

    // Props for ScrollView component
    static defaultProps = {
        // Arrange screens horizontally
        horizontal: true,
        // Scroll exactly to the next screen, instead of continous scrolling
        pagingEnabled: true,
        // Hide all scroll indicators
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        // Do not bounce when the end is reached
        bounces: false,
        // Do not scroll to top when the status bar is tapped
        scrollsToTop: false,
        // Remove offscreen child views
        removeClippedSubviews: true,
        // Do not adjust content behind nav-, tab- or toolbars automatically
        automaticallyAdjustContentInsets: false,
        // Fisrt is screen is active
        index: 0
    };

    state = this.initState(this.props);

    /**
     * Initialize the state
     */
    initState(props) {
        // Get the total number of slides passed as children
        const total = props.children ? props.children.length || 1 : 0, // total 5
            // Current index
            index = total > 1 ? Math.min(props.index, total - 1) : 0, // min(0,5)
            // Current offset
            offset = width * index; 

        const state = {
            total,
            index,
            offset,
            width,
            height,
        };

        // Component internals as a class property,
        // and not state to avoid component re-renders when updated
        this.internals = {
            isScrolling: false,
            offset
        };

        return state;
    }

    /**
     * Scroll begin handler
     * @param {object} e native event
     */
    onScrollBegin = e => {
        // Update internal isScrolling state
        this.internals.isScrolling = true;
    }

    /**
     * Scroll end handler
     * @param {object} e native event
     */
    onScrollEnd = e => {
        // Update internal isScrolling state
        this.internals.isScrolling = false;

        // Update index
        this.updateIndex(e.nativeEvent.contentOffset
            ? e.nativeEvent.contentOffset.x
            // When scrolled with .scrollTo() on Android there is no contentOffset
            : e.nativeEvent.position * this.state.width
        );
    }

    /*
     * Drag end handler
     * @param {object} e native event
     */
    onScrollEndDrag = e => {
        const { contentOffset: { x: newOffset } } = e.nativeEvent,
            { children } = this.props,
            { index } = this.state,
            { offset } = this.internals;

        // Update internal isScrolling state
        // if swiped right on the last slide
        // or left on the first one
        if (offset === newOffset &&
            (index === 0 || index === children.length - 1)) {
            this.internals.isScrolling = false;
        }
    }

    /**
     * Update index after scroll
     * @param {object} offset content offset
     */
    updateIndex = (offset) => {
        if (this.props.screen == 'firstAlbum' && this.state.index == 0) {
            if (!this.props.contacts.length) {
                this.props.setPopupContactsPermission(true)
            }
        }


        const state = this.state,
            diff = offset - this.internals.offset,
            step = state.width;
        let index = state.index;

        // Do nothing if offset didn't change
        if (!diff) {
            return;
        }

        // Make sure index is always an integer
        index = parseInt(index + Math.round(diff / step), 10);

        // Update internal offset
        this.internals.offset = offset;
        // Update index in the state
        this.setState({
            index
        });
    }

    /**
     * Swipe one slide forward
     */
    swipe = () => {

        // Ignore if already scrolling or if there is less than 2 slides
        if (this.internals.isScrolling || this.state.total < 2) {
            return;
        }

        const state = this.state,
            diff = this.state.index + 1,
            x = diff * state.width,
            y = 0;


        // Call scrollTo on scrollView component to perform the swipe
        this.scrollView && this.scrollView.scrollTo({ x, y, animated: true });

        // Update internal scroll state
        this.internals.isScrolling = true;

        // Trigger onScrollEnd manually on android
        if (Platform.OS === 'android') {
            setImmediate(() => {
                this.onScrollEnd({
                    nativeEvent: {
                        position: diff
                    }
                });
            });
        }
    }

    /**
     * Render ScrollView component
     * @param {array} slides to swipe through
     */
    renderScrollView = pages => {
        return (
            <ScrollView ref={component => { this.scrollView = component; }}
                {...this.props}
                style={{transform : [{scaleX: -1}]}}
                contentContainerStyle={[styles.wrapper, this.props.style]}
                onScrollBeginDrag={this.onScrollBegin}
                onMomentumScrollEnd={this.onScrollEnd}
                onScrollEndDrag={this.onScrollEndDrag}
            >
                {pages.map((page, i) =>
                    // Render each slide inside a View
                    <View style={[styles.fullScreen, styles.slide, {transform : [{scaleX: -1}]}]} key={i}>
                        {page}
                    </View>
                )}
            </ScrollView>
        );
    }

    /**
     * Render pagination indicators
     */
    renderPagination = () => {
        if (this.state.total <= 1) {
            return null;
        }

        const ActiveDot = <View style={[styles.dot, styles.activeDot]} />,
            Dot = <View style={styles.dot} />;

        let dots = [];

        for (let key = this.state.total; key > 0; key--) {
            dots.push(key <= this.state.index + 1
                // Active dot
                ? React.cloneElement(ActiveDot, { key })
                // Other dots
                : React.cloneElement(Dot, { key })
            );
        }
        return (
            <View
                pointerEvents="none"
                style={[styles.pagination, styles.fullScreen, this.props.screen == 'Walkthrough' ? {
                    alignItems: 'flex-end',
                    bottom: 100,
                    right:25
                } : { top: 70, alignItems: 'flex-start', }
                ]}
            >
                {dots}
            </View>
        );
    }

    /**
     * Render Continue or Done button
     */
    renderButton = () => {
        const buttonStyles = {
            backgroundColor: colors.nextButton,
            color: colors.black,
            height: 65,
            fontFamily: 'Arimo-Bold',
            width: this.props.screen === 'Walkthrough' ? width * 0.92 : width * 0.5,
            borderRadius: 26,
            fontSize: 17,
            left: this.props.screen === 'Walkthrough' ? 0 : 5,
            justifyContent: 'center',
        }
        const lastScreen = this.state.index === this.state.total - 1;
        return (
            <View pointerEvents="box-none" style={[styles.buttonWrapper, styles.fullScreen, { alignItems: this.props.screen === 'Walkthrough' ? 'center' : 'flex-start' }]}>
                {lastScreen
                    // Show this button on the last screen
                    ?
                    this.props.screen === 'Walkthrough' ?
                        <Button text="בואו נתחיל!" buttonStyles={buttonStyles} onPress={() => {
                             this.props.navigation.navigate('Signin') 
                             AsyncStorage.setItem('walkedThrough', 'yes')
                            }} /> :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Button text="הבנתי" buttonStyles={buttonStyles} onPress={() => { this.props.setPopupBegin(true) }} />
                            <Image style={{ position: 'absolute', left: 130, top: 30 }} source={require('../../assets/images/iconsCircleCheck.png')} />
                        </View>
                    // Or this one otherwise
                    :
                    this.props.screen === 'Walkthrough' ?
                        <Button text="הבא" buttonStyles={buttonStyles} onPress={() => this.swipe()} />
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Button text="המשך" buttonStyles={buttonStyles} onPress={() => {this.swipe();}} />
                            <Image style={{ position: 'absolute', left: 130, top: 30 }} source={require('../../assets/images/iconsLeft.png')} />
                        </View>
                }
            </View>
        );
    }

    /**
     * Render the component
     */
    render = ({ children } = this.props) => {
        return (
            <View style={[styles.container, styles.fullScreen]}>
                {/* Render screens */}
                {this.renderScrollView(children)}
                {/* Render pagination */}
                {this.renderPagination()}
                {/* Render Continue or Done button */}
                {this.renderButton()}
                <ContactsPermission onClickNotPermission={()=> {this.swipe()}} popupContactsPermission={this.props.user.popupContactsPermission} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    // Set width and height to the screen size
    fullScreen: {
        width: width,
        height: height
    },
    // Main container
    container: {
        backgroundColor: 'transparent',
        position: 'relative'
    },
    // Slide
    slide: {
        backgroundColor: 'transparent'
    },
    // Pagination indicators
    pagination: {
        position: 'absolute',
        right: 25,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },
    // Pagination dot
    dot: {
        backgroundColor: 'rgb(212,214,242)',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
        bottom: 20
    },
    // Active dot
    activeDot: {
        backgroundColor: 'rgb(78,91,200)',
    },
    // Button wrapper
    buttonWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 6,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 40,
        justifyContent: 'flex-end',
    },
});

function mapStateToProps(state) {
    return {
        user: state.user,
        contacts: state.user.contacts
    }
}

export default connect(mapStateToProps, {
    setPopupContactsPermission,
    setPopupBegin
})(OnboardingScreens)