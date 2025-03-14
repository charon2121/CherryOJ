#include "order_map.h"

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

// 显式实例化 OrderMap 模板
// 如果有其他类型需要实例化，请在此添加
template class OrderMap<std::string, std::string>;
