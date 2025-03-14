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
    // 添加键值对，若 key 已经存在则更新 value
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
#endif // ORDER_MAP_H
