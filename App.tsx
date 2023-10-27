/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjQzMDQ0OGRmMmY4Mzg1Njk1YmFmZTU1MmNjNDIzMCIsInN1YiI6IjY1M2FiZmM1Y2M5NjgzMDE0ZWI3ZjJmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GFeGt6aEUv0mbE0usxj2LL5t31XTyffRLWEHFYF3Cqg',
  },
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [value, setValue] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log('getData', offset);
    setLoading(true);
    //Service to get the data from the server to render
    fetch(
      'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=' +
        offset,
      options,
    )
      //Sending the currect offset with get request
      .then(response => response.json())
      .then(responseJson => {
        //Successful response
        setDataSource(
          offset === 1
            ? responseJson.results
            : [...dataSource, ...responseJson.results],
        );
        setLoading(false);
        setOffset(offset + 1);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getsearchResult = () => {
    console.log('getsearchResult');
    setLoading(true);
    //Service to get the data from the server to render
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=false&language=en-US&page=${offset}`,
      options,
    )
      //Sending the currect offset with get request
      .then(response => response.json())
      .then(responseJson => {
        //Successful response
        setDataSource(
          offset === 1
            ? responseJson.results
            : [...dataSource, ...responseJson.results],
        );
        setLoading(false);
        setOffset(offset + 1);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            value === '' ? getData() : getsearchResult();
          }}
          //On Click of button load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {loading ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            padding: 10,
          }}
          onPress={() => getItem(item)}>
          {item.title.toUpperCase()}
        </Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = item => {
    //Function for click on an item
    alert(`Title : ${item.title}\nOverview : ${item.overview}`);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <InputBox
          onChangeText={onChange => {
            setOffset(1);
            setValue(onChange);
          }}
          value={value}
          autoCapitalize={'none'}
          placeholder={'Search here'}
          returnKeyLabel={'done'}
          returnKeyType={'done'}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            if (value.length === 0) {
              getData();
            } else {
              getsearchResult();
            }
          }}
        />
        <FlatList
          data={dataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});

const InputBox = styled.TextInput`
  height: 50px;
  width: 100%;
  margin: 12px;
  border-radius: 5px;
  border-color: white;
  border-width: 1px;
  background-color: #fff;
  padding-left: 5px;
  color: #000000;
  font-weight: 400;
  font-family: Poppins-Regular;
`;

export default App;
