import pathlib

from setuptools import find_packages, setup

here = pathlib.Path(__file__).parent.resolve()

long_description = (here / "README.md").read_text(encoding="utf-8")

setup(
    name="louriest_discord",
    version="2.0.0",
    description="A personal discord bot",
    long_description=long_description,
    long_description_conten_type="text/markdown",
    author="Yashodhan Ketkar",
    author_email="kykyashodhan@gmail.com",
    classifiers=[
        "Development Status :: 5",
        "Programming Language :: Python :: 3.10",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache 2.0 License",
        "Operating System :: Windows NT system"
    ],
    keywords="louriest",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.10",
    install_requires=[
        "discord",
        "google",
    ],
    extrasa_require={
        "dev": [
            "flake8",
            "black",
            "isort",
        ],
    },
)
