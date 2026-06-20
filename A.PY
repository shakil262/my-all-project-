import sys


def calculate_total_energy(x: int, n: int) -> int:
    return x if n % 2 else 0


def main():
    try:
        t = int(input())
    except EOFError:
        return

    for _ in range(t):
        try:
            x, n = map(int, input().split())
        except EOFError:
            break
        print(calculate_total_energy(x, n))


if __name__ == "__main__":
    main()
    
    