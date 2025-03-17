#ifndef ORDER_MAP_H
#define ORDER_MAP_H

#include <vector>
#include <unordered_map>
#include <algorithm>

template <typename K, typename V>
class OrderMap {
public:
    OrderMap() = default;
    ~OrderMap() = default;
   
    void add(const K& key, const V& value);
    // 移除键值对
    void remove(const K& key);
    // 获取键值对
    const V& get(const K& key) const;
    // 获取所有键
    std::vector<K> get_keys() const;
    // 获取所有值
    std::vector<V> get_values() const;
private:
    std::unordered_map<K, V> map;
    std::vector<K> keys;
};

template <typename K, typename V>
void OrderMap<K, V>::add(const K& key, const V& value) {
    if (map.find(key) == map.end()) {
        keys.push_back(key);
    }
    map[key] = value;
}

template <typename K, typename V>
void OrderMap<K, V>::remove(const K& key) {
    auto it = map.find(key);
    if (it == map.end()) {
        return;
    }
    map.erase(it);
    keys.erase(std::remove(keys.begin(), keys.end(), key), keys.end());
}

template <typename K, typename V>
const V& OrderMap<K, V>::get(const K& key) const {
    return map.at(key);
}

template <typename K, typename V>
std::vector<K> OrderMap<K, V>::get_keys() const {
    return keys;
}

template <typename K, typename V>
std::vector<V> OrderMap<K, V>::get_values() const {
    std::vector<V> values;
    for (const auto& key : keys) {
        values.push_back(map.at(key));
    }
    return values;
}

#endif // ORDER_MAP_H
