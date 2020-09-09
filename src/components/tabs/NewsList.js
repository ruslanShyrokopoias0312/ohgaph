import React from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableHighlight, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import * as newsApi from '../../lib/news'
import ReadMore from '../parts/ReadMore.js'
import moment from 'moment-timezone'
import { errorHandle } from '../../lib/api'
import Loading from '../parts/Loading'
import DeviceInfo from 'react-native-device-info'

import ImageView from 'react-native-image-view'

const isTablet = DeviceInfo.isTablet()
const {height, width} = Dimensions.get('window')

export default class NewsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            actionTime: props.actionTime(),
            news: null,
            refreshing: false,
            nextCursor: 0,
            openImageSource: ""
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <ImageView
                    source={{uri: this.state.openImageSource}}
                    isVisible={!!this.state.openImageSource}
                    animationType='fade'
                    onClose={() => {this.setState({openImageSource: ''})}}
                />
                {(() => {
                    return !this.state.news ?
                        <Loading/> :
                        <FlatList
                            style={this.state.news ? {opacity: 1} : {opacity: 0}}
                            data={this.state.news || []}
                            keyExtractor={(item, index) => item.id}
                            onEndReachedThreshold={0.1}
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({refreshing: true})
                                newsApi.get().then(({items, next}) => {
                                    this.setState({news: items, nextCursor: next, refreshing: false})
                                }).catch(err => {
                                    this.setState({refreshing: false})
                                    errorHandle(err)
                                })
                            }}
                            windowSize={1000}
                            removeClippedSubviews={false}
                            onEndReached={this.moreLoad.bind(this)}
                            renderItem={({item, index}) => {

                                if(item.is_alignment) {
                                    return <Text style={styles.alignment}>これ以上お知らせはありません</Text>
                                } else {
                                    let update = moment(item.created_at).format('YYYY/MM/DD')

                                    return (
                                        <View style={styles.li}>
                                            <View style={styles.left}>
                                                <Text style={styles.title}>{item.title}</Text>
                                                <ReadMore
                                                    numberOfLines={2}
                                                    id={item.id}
                                                    style={styles.detail}
                                                    onReady={() => {
                                                        if(this.state.news.length === index + 1) this.setState({isReady: true})
                                                    }}>
                                                    {item.detail}
                                                </ReadMore>
                                                <Text style={{color: '#444', fontSize: isTablet ? 11 : 13, paddingTop: 10}}>{update}</Text>
                                            </View>
                                            <View style={styles.right}>
                                                {(()=> {
                                                    return item.image ? (
                                                        <TouchableHighlight onPress={() => {this.setState({openImageSource: item.image})}}>
                                                            <Image
                                                                source={{uri: item.image}}
                                                                resizeMode={"contain"}
                                                                style={{width: isTablet ? 60 : 80, height: isTablet ? 60 : 80}}
                                                            />
                                                        </TouchableHighlight>) : null
                                                })()}
                                            </View>
                                        </View>
                                    )
                                }
                            }}
                        />
                })()}
            </View>

        )
    }

    async componentDidUpdate(prevProps, prevState) {
        if(this.state.actionTime !== null) {
            newsApi.get().then(({items, next}) => {
                this.setState({news: items, nextCursor: next, actionTime: null})
            }).catch(err => { errorHandle(err) })
        }
    }

    componentDidMount(){
        newsApi.get().then(({items, next}) => {
            this.setState({news: items, nextCursor: next})
        }).catch(err => { errorHandle(err) })
    }

    moreLoad() {
        if(this.state.news.length === 0 || !~this.state.nextCursor) return false
        newsApi.get(this.state.nextCursor).then(({items, next}) => {

            if(next == -1) { items.push({is_alignment: true, id: 0}) }

            let oldNewsList = this.state.news
            this.setState({news: oldNewsList.concat(items), nextCursor: next})


        }).catch(err => { errorHandle(err) })
    }

}

const styles = StyleSheet.create({
    li: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
    },
    left: {
        paddingHorizontal: 10,
        flex: 1
    },
    right: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        color: '#111',
        letterSpacing: 1,
        fontSize: isTablet ? 14 : 16,
        paddingVertical: isTablet ? 7 : 10
    },
    detail: {
        fontSize: isTablet ? 12 : 14,
        lineHeight: isTablet ? 14 : 16,
        letterSpacing: 1,
        color: '#444'
    },
    alignment: {
        paddingVertical: 15,
        textAlign: 'center',
        color: '#666',
        letterSpacing: 2,
        fontSize: isTablet ? 12 : 13,
    }
})
