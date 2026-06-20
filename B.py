import math


def find_craft_counts(n: int):
    if n < 4 or n % 2 != 0:
        return -1

    min_crafts = math.ceil(n / 6)
    while (n - min_crafts * 6) % 4 != 0:
        min_crafts += 1

    max_crafts = n // 4
    while (n - max_crafts * 4) % 6 != 0:
        max_crafts -= 1

    return min_crafts, max_crafts


def main():
    t = int(input())

    for _ in range(t):
        n = int(input())

        result = find_craft_counts(n)

        if result == -1:
            print(-1)
        else:
            print(*result)


if __name__ == "__main__":
    main()