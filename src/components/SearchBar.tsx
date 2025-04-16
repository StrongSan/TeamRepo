import * as React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import SearchIcon from '../../assets/icons/search-icon.svg';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBarWrapper}>
        <SearchIcon style={styles.searchIcon} />
        <View style={styles.searchTextContainer}>
          <Text style={styles.searchText}>케이크 검색하기</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    display: "flex",
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "column",
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  searchBarWrapper: {
    alignItems: "center",
    borderRadius: 32,
    backgroundColor: "#EFF1F5",
    display: "flex",
    width: "100%",
    paddingLeft: 16,
    paddingRight: 48,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
    flexDirection: "row",
  },
  searchIcon: {
    aspectRatio: 1,
    width: 24,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flexShrink: 0,
  },
  searchTextContainer: {
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  searchText: {
    fontSize: 16,
    color: "#A09CAB",
    fontWeight: "400",
  },
});

export default SearchBar;
